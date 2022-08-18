// ------------------ FIREBASE -----------------//

const firebaseConfig = {
  apiKey: "AIzaSyAB27hXAECxsaM16NBjN0LxPbZSkv0cbIQ",
  authDomain: "nyt-best-sellers-851aa.firebaseapp.com",
  projectId: "nyt-best-sellers-851aa",
  storageBucket: "nyt-best-sellers-851aa.appspot.com",
  messagingSenderId: "197509556446",
  appId: "1:197509556446:web:d94f8e1cca01239db9fa4f"
};

//------------------ Initialize Firebase ------------------//
firebase.initializeApp(firebaseConfig);

//para llamar a la bbdd
const db = firebase.firestore();
//para la auth
const auth = firebase.auth();


const registro = document.getElementById('signup-form');

//funciónpara crear la colección ('users) y añadir la info recogida
const saveUsers = (email, password) =>
    db.collection("users").doc().set({
        email,
        password
    })


    //función para submit los datos agregados en los inputs
    registro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('signup-mail').value
      const password = document.getElementById('signup-password').value

      await saveUsers(email, password);
      registro.reset();

      console.log('dato recogido')

})



//----------------- funciones para signUp -----------------//
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  //valor inputs
  const email = document.getElementById('signup-mail').value;
  const password = document.getElementById('signup-password').value;
  
  auth
  .createUserWithEmailAndPassword(email, password)
  .then(userCredential => {

    //limpiamos el form
    signupForm.reset();
    console.log('usuario registrado')
  })
})


//----------------- funciones para signIn -----------------//
const signinForm = document.getElementById('signin-form');

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //valor inputs
  const email = document.getElementById('signin-mail').value;
  const password = document.getElementById('signin-password').value;
  
  auth
  .signInWithEmailAndPassword(email, password)
  .then(userCredential => {

    //limpiamos el form
    signupForm.reset();
    console.log('sign in: usuario logado')
  })
})


//----------------- función para logout -----------------//
const logout = document.getElementById('logout');

logout.addEventListener('click', e => {
  e.preventDefault();

  auth.signOut().then(() => {
    console.log('sesión cerrada')
  })
})


//----------------- Crear BBDD + añadir info -----------------//
const tablon = document.getElementById('tablon');



//----------------- Events for users -----------------//

auth.onAuthStateChanged(user =>{
  if (user) {
    console.log('auth: OK, sign in')
  }
})










// -------------- GESTIÓN ENTRADAS ----------------//

// async function bringEntries () {
//     try {
//         let responseBooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6UgXRIVdy52ixbIvS1lEzoGQUOfC6qQ7`);
//         let data = await responseBooks.json()
//         const entry = document.getElementsByClassName("entry")[0];
//         entry.style.display="none";
//         return data
        
//     } catch (error) {
//         console.error(error);
//     }
// }

// bringEntries().then(function bringBooks(books){
//     let categories = books.results

//     //Para cada categoría:
//     categories.forEach((category, i) => {

//         //creamos tarjetas:
//         let h3 = document.createElement("h3");
//         let pOld = document.createElement("p");
//         let pNew = document.createElement("p");
//         let pUpdate = document.createElement("p");
//         let btn = document.createElement("button");
//         let div = document.createElement("div");
//         let tablon = document.getElementById("tablon");

//         div.append(h3,pOld,pNew,pUpdate,btn)
//         tablon.appendChild(div)

//         //añadimos info de cada uno
//         h3.innerHTML = category.display_name
//         pOld.innerHTML = `Oldest: ${category.oldest_published_date}`
//         pNew.innerHTML = `Newest: ${category.newest_published_date}`
//         pUpdate.innerHTML = `Updated: ${category.updated}`
//         btn.innerHTML = "READ MORE"

//         //estilos:
//         h3.classList = "title"
//         btn.classList = "button"
//         div.classList = "divCategories"

//     });
// })