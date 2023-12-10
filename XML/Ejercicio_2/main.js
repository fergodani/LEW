"use strict";
class XMLFile {
  constructor() {
    this.html = "<main>"
  }

  async readXML(files) {
    const self = this;
    let templateHTML = await this.readFile("template.html")
    let templateCSS = await this.readFile("template.css")
    const lector = new FileReader();
    lector.onload = function (event) {
      self.parseXML(event, templateHTML, templateCSS)
    }
    lector.readAsText(files[0])
  }

  parseXML(event, templateHTML, templateCSS) {
    const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(event.target.result, 'application/xml')
      const header = xmlDoc.querySelector("cabecera").innerHTML
      const colorPrimary = xmlDoc.querySelectorAll("color")[0].innerHTML
      const colorSecondary = xmlDoc.querySelectorAll("color")[1].innerHTML
      const fontColor = xmlDoc.querySelectorAll("color")[2].innerHTML
      const authors = xmlDoc.querySelectorAll("autor")
      this.parseAuthors(authors)
      this.html = this.html + "</main>"
      templateHTML = templateHTML.replace("&header", header)
      templateHTML = templateHTML.replace("&main", this.html)
      templateHTML = templateHTML.split("<!--")[0] + templateHTML.split("<script>")[1].split("</script>")[1]
      console.log(templateHTML)
      templateCSS = templateCSS.replace("&primary", colorPrimary)
      templateCSS = templateCSS.replace("&secondary", colorSecondary)
      templateCSS = templateCSS.replace("&fontColor", fontColor)
  
      this.downloadFiles(templateHTML, templateCSS)
  }

  parseAuthors(authors) {
    authors.forEach((author) => {
      const image = author.querySelector("imagen").innerHTML;
      const name = author.getAttribute("nombre");
      const birth = author.getAttribute("nacimiento");
      this.html = this.html + "<section><h2>"+name+"</h2><article><img  alt='" + image + "' src='./multimedia/" + image + "'/><h2>" +
        name + "</h2><p>" + birth +
        "</p></article><section><h2>Libros</h2>";
      const books = author.querySelectorAll("libro")
      this.parseBooks(books)
      this.html = this.html + "</section></section>"
    })
  }

  parseBooks(books) {
    books.forEach((book) => {
      const title = book.querySelector("titulo").innerHTML
      const subject = book.querySelector("genero").innerHTML
      const cover = book.querySelector("imagen").innerHTML
      const publisher = book.querySelector("editorial").innerHTML
      const date = book.querySelector("salida").innerHTML
      const summary = book.querySelector("sinopsis").innerHTML
      const score = book.querySelector("puntuacion").innerHTML
      const isbn = book.querySelector("isbn").innerHTML

      this.html = this.html + "<article><img alt='" + cover + "' src='./multimedia/" + cover + "'/><h2>" +
      title + "</h2>" +
      "<p><b>Editorial:</b> " + publisher + "</p>" +
      "<p><b>Fecha de salida:</b> " + date + "</p>" +
      "<p><b>Sinopsis:</b> " + summary + "</p>" +
      "<p><b>Puntuación:</b> " + score + "</p>" +
      "<p><b>ISBN:</b> " + isbn + "</p>" +
      "<p><b>Género:</b> " + subject + "</p></article>"
    })
  }

  async readFile(url) {
    return new Promise((resolve, reject) => {
      const xhr =new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status == 200)
            resolve(xhr.responseText)
          else
            reject(`Error al leer el fichero: ${xhr.status}`)
        }
      };
      xhr.open('GET', url)
      xhr.send();
    })
  }

  downloadFiles(templateHTML, templateCSS) {
    let htmlBlob = new Blob([templateHTML], { type: "text/html"})
    let cssBlob = new Blob([templateCSS], { type: "text/css"})

    let urlHtml = window.URL.createObjectURL(htmlBlob);
    let urlCss = window.URL.createObjectURL(cssBlob);
    
    let downloadLink = document.createElement("a")

    downloadLink.href = urlHtml;
    downloadLink.download = "ejercicio2.html";
    downloadLink.click();

    downloadLink.href = urlCss;
    downloadLink.download = "ejercicio2.css";
    downloadLink.click();

    window.URL.revokeObjectURL(urlHtml);
    window.URL.revokeObjectURL(urlCss);
  }

}

let xml = new XMLFile()