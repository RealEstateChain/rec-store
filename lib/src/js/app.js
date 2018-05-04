App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../houses.json', function(data) {
      var petsRow = $('#homeRow');
      var homeTemplate = $('#homeTemplate');

      for (i = 0; i < data.length; i ++) {
        homeTemplate.find('.panel-title').text(data[i].name);
        homeTemplate.find('img').attr('src', data[i].picture);
        homeTemplate.find('.home-locality').text(data[i].locality);
        homeTemplate.find('.home-age').text(data[i].age);
        homeTemplate.find('.home-location').text(data[i].location);
        homeTemplate.find('.btn-buy').attr('data-id', data[i].id);

        petsRow.append(homeTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
      // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.Adoption = TruffleContract(data);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markBought();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleAdopt);
  },

  markBought: function(buyers, account) {
        var adoptionInstance;

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.getAdopters.call();
      }).then(function(buyers) {
        for (i = 0; i < buyers.length; i++) {
          if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-house').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var homeId = parseInt($(event.target).data('id'));

        var adoptionInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;

          // Execute adopt as a transaction by sending account
          return adoptionInstance.adopt(homeId, {from: account});
        }).then(function(result) {
          return App.markBought();
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
