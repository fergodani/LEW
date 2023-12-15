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

        var results = [];

        const words = searchTerm.split(' ');
        for (const word of words) {
            for (const element of pages) {
                var content = element.getElementsByTagName('content')[0].innerHTML
                var url = element.getElementsByTagName('url')[0].childNodes[0].nodeValue;
                content = content.trim().toLowerCase()
                if (content.includes(word.toLowerCase()) && !results.includes(url)) {
                    results.push(url);
                }
            }
        }

        const dropdown = document.querySelector("div section")
        dropdown.style.display = "grid";
        dropdown.innerHTML = "<h3>Resultados</h3>"
        const input = document.querySelector("div section h3");
        for (const result of results) {
            var button = document.createElement('button');
            button.textContent = result.split(".")[1].split("/")[1];
            button.onclick = () => {
                this.goTo(result, words)
            }
            input.after(button)
        }
        if (results.length == 0) {
            input.insertAdjacentHTML("afterend", "<p>No se han encontrado resultados</p>")
        }
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

    goTo(url, words) {
        localStorage.setItem('words', JSON.stringify(words))
        window.location.href = url;

    }

}

document.addEventListener('DOMContentLoaded', function () {
    const words = JSON.parse(localStorage.getItem('words'))
    if (words != null) {
        for (const word of words) {
            const leafNodes = getLeafNodes(document.body)
            
            for (const node of leafNodes) {
                if (node.innerText.trim().toLowerCase().includes(word)){
                    node.classList.add('highlight');
                }
            }
        }
        localStorage.removeItem('words')
    }
    const elemento = document.querySelectorAll(".highlight");
    if (elemento.length != 0)
        elemento[0].scrollIntoView({behavior: 'smooth'})
});

function getLeafNodes(master) {
    var nodes = Array.prototype.slice.call(master.getElementsByTagName("*"), 0);
    var leafNodes = nodes.filter(function(elem) {
        return elem.children.length == 0;
    });
    return leafNodes;
}

let xml = new XMLFile()