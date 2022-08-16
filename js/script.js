// -------------- GESTIÓN ENTRADAS ----------------//

async function bringEntries () {
    try {
        let responseBooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6UgXRIVdy52ixbIvS1lEzoGQUOfC6qQ7`);
        let data = await responseBooks.json()
        const entries = document.getElementsByClassName("entries")[0];
        entries.style.display="none";
        return data
        console.log(data)
        
    } catch (error) {
        console.error(error);
    }
}

bringEntries().then(function bringBooks(books){
    let categories = books.results

    //Para cada categoría:
})