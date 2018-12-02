window.onload = init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [{
                    nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'Sun City Café',
                    cuisine: 'Américaine'
                }
            ],
            nom: '',
            cuisine: '',
            nbRestaurants:0,
            page:0,
            pagesize:10,
            name:""
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page + "&pagesize=" +
                    this.pagesize + "&name=" +
                    this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                this.restaurants = reponseJS.data;
                                this.nbRestaurants = reponseJS.count;
                                console.log(reponseJS.msg);
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            supprimerRestaurant(index) {
                this.restaurants.splice(index, 1);
            },
            modifierRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let form = event.target;

                // 2 - on récupère le contenu du formulaire
                let dataFormulaire = new FormData(form);

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants/" + this.nom;
                fetch(url, {
                    method: "POST",
                    body: dataFormulaire
                })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                this.nom = "";
                this.cuisine = "";
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let form = event.target;

                // 2 - on récupère le contenu du formulaire
                let dataFormulaire = new FormData(form);

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                
                this.nom = "";
                this.cuisine = "";
            },
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            },
            
            pageSuivante() {
                this.page++;
                this.getRestaurantsFromServer();
            },
            pagePrecedante() {
                this.page--;
                this.getRestaurantsFromServer();
            },
            pageCurrent() {
                this.getRestaurantsFromServer();
            },
            pageFirst() {
                this.page = 0;
                this.getRestaurantsFromServer();
            },
            pageLast() {
                this.page = this.nbRestaurants/10;
                this.getRestaurantsFromServer();
            },
            chercherRestaurants: _.debounce(function () {
                this.getRestaurantsFromServer();
            }, 500)
        }
    })
}