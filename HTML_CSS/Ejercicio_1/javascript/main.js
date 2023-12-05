"use strict";
class XMLFile {
    constructor() {
        this.books = [];
        this.booksFiltered = [];
        this.index = 0;
        this.pagesOrdered = null;
        this.content = null;
        this.bookIndex = 1;
    }

    async search() {
        var searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm == "") return
        const data = await this.readFile("./javascript/sitemap.xml");
        var pages = data.getElementsByTagName('page');
        console.log(pages)
        var results = [];

        // Recorre las páginas y busca la palabra clave en el contenido
        for (var i = 0; i < pages.length; i++) {
            var content = pages[i].getElementsByTagName('content')[0].innerHTML
            var url = pages[i].getElementsByTagName('url')[0].childNodes[0].nodeValue;
            console.log(content)
            console.log(url)
            if (content.includes(searchTerm)) {
                results.push(url);
            }
        }
        console.log(results)
        window.location.href = results[0];
    }

    readFile(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: "xml",
                url: url,
                method: 'GET',
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            })
        })
    }
}

let xml = new XMLFile()