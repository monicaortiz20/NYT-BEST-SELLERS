// ------------------ FIREBASE -----------------//

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA4n8rngi4aJiTimJAV1ZqEj6t7bqhbShU",
    authDomain: "nyt-best-sellers-6ae9f.firebaseapp.com",
    projectId: "nyt-best-sellers-6ae9f",
    storageBucket: "nyt-best-sellers-6ae9f.appspot.com",
    messagingSenderId: "642446888824",
    appId: "1:642446888824:web:de443e5e4a271322f4c28d"
  };

  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //para llamar a la bbdd
    const db = firebase.firestore();

    //Creación de la colección "users"
    const createUser = (user) => {
        db.collection("users")
            .add(user)
            .then((docRef) => console.log("Document written with ID: ", docRef.id))
            .catch((error) => console.error("Error adding document: ", error));
    };


    //Auth Firebase con Google
    let provider = new firebase.auth.GoogleAuthProvider();
    //coleccion users
    const collect = db.collection('users').doc();
    
    //función para logarse con Google
    async function loginGoogle(){
       try {
            const response = await firebase.auth().signInWithPopup(provider);
            console.log(response)
            if (response.user) {
                document.getElementById('login').style.display = "none";
                document.getElementById('logout').style.display = "none";

                // Usuario registrado
                const user = document.getElementById('usuario')
                const name = document.createElement("p")

                user.append(name)
                name.innerHTML = `User ${response.additionalUserInfo.profile.given_name}`

                //Añadir usuario a la bbdd
                collect.set({
                    Name: response.additionalUserInfo.profile.given_name,
                    Email: response.additionalUserInfo.profile.email,
                    ID: collect.id
                })
            }
        
       } catch (error) {
            throw new Error(error);
       }
    }



    //Botón para logarse con Google
    const googleBtn = document.getElementById('login')

    googleBtn.addEventListener('click', async (event) => {
        try {
            await loginGoogle()
        } catch (error) {}
    })



// -------------- GESTIÓN ENTRADAS ----------------//

async function bringEntries () {
    try {
        let responseBooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6UgXRIVdy52ixbIvS1lEzoGQUOfC6qQ7`);
        let data = await responseBooks.json()
        const entry = document.getElementsByClassName("entry")[0];
        entry.style.display="none";
        return data
        
    } catch (error) {
        console.error(error);
    }
}

bringEntries().then(function bringBooks(books){
    let categories = books.results

    //Para cada categoría:
    categories.forEach((category, i) => {

        //creamos tarjetas:
        let h3 = document.createElement("h3");
        let pOld = document.createElement("p");
        let pNew = document.createElement("p");
        let pUpdate = document.createElement("p");
        let btn = document.createElement("button");
        let div = document.createElement("div");
        let tablon = document.getElementById("tablon");

        div.append(h3,pOld,pNew,pUpdate,btn)
        tablon.appendChild(div)

        //añadimos info de cada uno
        h3.innerHTML = category.display_name
        pOld.innerHTML = `Oldest: ${category.oldest_published_date}`
        pNew.innerHTML = `Newest: ${category.newest_published_date}`
        pUpdate.innerHTML = `Updated: ${category.updated}`
        btn.innerHTML = "READ MORE"

        //estilos:
        h3.classList = "title"
        btn.classList = "button"
        div.classList = "divCategories"

    });
})