// -------------- GESTIÓN ENTRADAS ----------------//

async function bringEntries () {
    try {
        let responseBooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6UgXRIVdy52ixbIvS1lEzoGQUOfC6qQ7`);
        let data = await responseBooks.json()
        console.log(data)
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