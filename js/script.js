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


const infoUser = db.collection('users').doc();


//función para submit los datos agregados en los inputs
registro.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById('signup-mail').value
    const password = document.getElementById('signup-password').value

    await saveUsers(email, password);
    registro.reset();

    console.log('dato recogido')

  } catch (error) {
    console.log(error)
  }

})



//----------------- Botones registro e inicio sesión -----------------//

const registered = document.getElementById('registered-btn')
const iniciated = document.getElementById('iniciate-btn')

document.getElementById('signup-section').style.display = "none";
document.getElementById('signin-section').style.display = "none";
document.getElementById('logout').style.display = "none"


registered.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('signup-section').style.display = "flex";
  document.getElementById('signin-section').style.display = "none";

})

iniciated.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('signup-section').style.display = "none";
  document.getElementById('signin-section').style.display = "flex";
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


      document.getElementById('logout').style.display = "flex"
      registered.style.display = "none"
      iniciated.style.display = "none"

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

  auth.signInWithEmailAndPassword(email, password).then(userCredential => {
    

      registered.style.display = "none"
      iniciated.style.display = "none"
      document.getElementById("greetings").style.fontSize = "25px"
      document.getElementById("greetings").style.textAlign = "center"
      document.getElementById("greetings").style.margin = "5px"
      document.getElementById("greetings").innerHTML = `¡Bienvenid@ ${userCredential.user.email}!`

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

    document.getElementById('cerrarSesion').style.display = "none"
    document.getElementById("greetings").style.display = "none"

    registered.style.display = "flex"
    iniciated.style.display = "flex"
  })
})


const tablon = document.getElementById('tablon');



//----------------- Events for users -----------------//

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('auth: OK, sign in')
    document.getElementById('signup-section').style.display = "none";
    document.getElementById('signin-section').style.display = "none";
    signupForm.style.display = "none"
    signinForm.style.display = "none"
    document.getElementById('logout').style.display = "flex"
  }
})




// -------------- GESTIÓN CATEGORÍAS DE LIBROS  ----------------//

async function bringEntries() {
  try {
    let responseBooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6UgXRIVdy52ixbIvS1lEzoGQUOfC6qQ7`);
    let data = await responseBooks.json()
    const entry = document.getElementsByClassName("entry")[0];
    entry.style.display = "none";
    return data

  } catch (error) {
    console.error(error);
  }
}


bringEntries().then(data => {
  bringBooks(data)
}).catch(error => {

})

function bringBooks(cat) {
  let categories = cat.results
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

    div.append(h3, pOld, pNew, pUpdate, btn)
    tablon.appendChild(div)

    //añadimos info de cada uno
    h3.innerHTML = category.display_name
    pOld.innerHTML = `Oldest: ${category.oldest_published_date}`
    pNew.innerHTML = `Newest: ${category.newest_published_date}`
    pUpdate.innerHTML = `Updated: ${category.updated}`
    btn.innerHTML = "READ MORE"
    btn.setAttribute("position", i)
    btn.setAttribute("src", category.list_name_encoded)
    btn.setAttribute("onclick", "booksList();")

    //estilos:
    h3.classList = "title"
    btn.classList = "button"
    div.classList = "divCategories"

  });


  
}

 
 // -------------- GESTIÓN LIBROS dentro de las categorías ----------------// 

async function booksList () {
  let booksList = await fetch (`https://api.nytimes.com/svc/books/v3/lists/${event.srcElement.attributes.src.nodeValue}.json?api-key=U5XodN0WD6AxEelHTmcyeksK5nC8On22`)
  let dataBooks = await booksList.json();
  bookDetail(dataBooks.results)
  for(let cat of document.getElementsByClassName("divCategories")){
    cat.style.display = "none"
  }
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}




function bookDetail(results){
  let usuario = firebase.auth().currentUser

  //tarjeta de cada libro:

  const mainTitle = document.createElement("h2")
  mainTitle.innerHTML = results.display_name

  const btnBack = document.createElement("div")
  btnBack.innerHTML = `
                      <section>
                      <input type="submit" class="btnBack" value="Go back"/>
                      </section>
                      `
  document.body.append(mainTitle, btnBack)
  
  //para que salga un tablón nuevo con los libros
  const newDesck = document.createElement("section")
  newDesck.id = "newDesk"

  const allBooks = results.books

  allBooks.forEach(function (info, j){


    //para que aparezca en el HTML:
    let divBooks = document.createElement("div")
    divBooks.classList = "divBooks"

    newDesck.appendChild(divBooks)

    //estructura tarjetas:
    let titleBook = document.createElement("h3")
    let imgPortada = document.createElement("img")
    let pWeek = document.createElement("p")
    let description  = document.createElement("p")
    let divBtn = document.createElement("div")
    


    imgPortada.src = info.book_image;
    imgPortada.classList = "portada";
    divBooks.append(titleBook,imgPortada,pWeek,description,divBtn);
    document.body.appendChild(newDesck);


    titleBook.innerText = `#${info.rank}. ${info.title}`;
    pWeek.innerHTML = `<i>Weeks on list: ${info.weeks_on_list}</i>`;
    description.innerHTML = info.description;
    divBtn.innerHTML = `
                    <form action="${info.amazon_product_url}">
                        <input type="submit" class="amazon" value="Buy with Amazon!"/>
                    </form>`
 
    if(usuario != null){
      // aqui poner posible boton de like solo par logueados
      const btnLike = document.createElement("button")
      divBooks.append(btnLike)
      btnLike.classList = "likeBtn"
      btnLike.innerHTML = "Like it!"

      // document.getElementsByClassName("likeBtn")[j].addEventListener('click', favBooks())
      // function favBooks (){
      //   let usuario = firebase.auth().currentUser
      //   let likeBooks = db.collection("loveBooks").doc()
      //   likeBooks.set({
      //     id: usuario.id,
      //     favBook: info.title
      //   })
      //   } 

    } else {
      console.log("No hay ningún usuario logado")
    }

  })
}


//-------------- botón Go Back! -------------//
// const btnBack = document.getElementsByClassName("btnBack")

// btnBack.addEventListener('submit', e => {
//   e.preventDefault()

//   try {
//     document.getElementsByClassName("divBooks").style.display = "none"
//     document.getElementsByClassName("divCategories").style.display = "flex"

//   } catch (error) {
//     console.log(error)
//   }
// })


  //------------ Cerrar sesión ------------------////
  const signOut = () => {
    let usuario = firebase.auth().currentUser

    firebase.auth().signOut().then(() => {

      document.getElementById("login").style.display = "flex"
      document.getElementById("logout").style.display = "none"

      document.getElementsByClassName("like")[i].style.display = "none";

      //para quitar datos de usuario logado
      document.getElementById("user").remove()

    }).catch((error) => {
      console.log("Ha habido un error: " + error);
    });
  }

  document.getElementById("logout").addEventListener("click", signOut);

