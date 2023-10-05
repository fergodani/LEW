"use strict";
class XMLFile {
  constructor() {
    this.authors = [];
  }

  

  drawBooks() {
    $("main").html("");
    let index = 0;
    this.books.forEach((book) => {
      $("main").append(
        "<article><img src='" + book.content.get("cover.jpg") + "'/><h2>" + 
        book.title + "</h2><p>" + book.author + 
        "</p><button onclick='xml.books["+index+
        "].viewDetails()'>Detalles</button><button onclick='xml.books["+index+
        "].readBook("+index+")'>Leer</button></article>"
      )
      $("main select").change(function(){
        var option = $(this).val();
        book.state = option;
      })
      index++;
    })
  }

  goBackAuthors() {
    $("main").show()
    $("header + button").hide()
    $("section").hide()
    $("input").show();
    $("button + h2").show();
  }

  readXML(files) {
    const lector = new FileReader();
    const self = this;
    lector.onload = function(event) {
        $("section").hide()
        $("main").empty()
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(event.target.result, 'application/xml')
        const colorPrimary = xmlDoc.querySelectorAll("color")[0].innerHTML
        const colorSecondary = xmlDoc.querySelectorAll("color")[1].innerHTML
        const fontColor = xmlDoc.querySelectorAll("color")[2].innerHTML
        self.changeStyle(colorPrimary, colorSecondary, fontColor)
        self.authors = xmlDoc.querySelectorAll("autor")
        let index = 0;
        self.authors.forEach((author) => {
            const image = author.querySelector("imagen").innerHTML;
            const name = author.getAttribute("nombre");
            const birth = author.getAttribute("nacimiento");
            $("main").append(
                "<article><img src='./multimedia/" + image + "'/><h2>" + 
                name + "</h2><p>" + birth + 
                "</p><button onclick='xml.showBooks(" + index + ")'>Ver libros</button>"
              )
            index++;
        })
    }
    lector.readAsText(files[0])
  }

  changeStyle(colorPrimary, colorSecondary, fontColor) {
    $("body").css({"backgroundColor": colorSecondary})
    $("header").css({"backgroundColor":colorPrimary,"color":fontColor})
    $("button").css("backgroundColor", colorPrimary)
    $("button").css("color", fontColor)
  }

  showBooks(authorIndex) {
    const author = this.authors[authorIndex];
    const books = author.querySelectorAll("libro")
    $("header + button").show()
    $("main").hide()
    $("main + section").show()
    $("main + section").empty()
    let index = 0;
    books.forEach((book) => {
        const title = book.querySelector("titulo").innerHTML
        const subject = book.querySelector("genero").innerHTML
        const cover = book.querySelector("imagen").innerHTML
        $("main + section").append(
            "<article><img src='./multimedia/" + cover + "'/><h2>" + 
            title + "</h2><p>" + subject + 
            "</p><button onclick='xml.showDetails(" + authorIndex + "," + index + ")'>Ver detalles</button>"
          )
        index++;
    })
  }

  goBackBooks() {
    $("header + button").show()
    $("button + button").hide()
    $("section + section").hide()
    $("main + section").show();
  }


  showDetails(authorIndex, bookIndex) {
    $("main + section").hide()
    $("header + button").hide()
    $("button + button").show()
    $("section + section").empty()
    $("section + section").show()
    const author = this.authors[authorIndex]
    const book = author.querySelectorAll("libro")[bookIndex]
    const title = book.querySelector("titulo").innerHTML
    const publisher = book.querySelector("editorial").innerHTML
    const date = book.querySelector("salida").innerHTML
    const summary = book.querySelector("sinopsis").innerHTML
    const score = book.querySelector("puntuacion").innerHTML
    const isbn = book.querySelector("isbn").innerHTML
    const subject = book.querySelector("genero").innerHTML
    const cover = book.querySelector("imagen").innerHTML
    $("section + section").append(
        "<article><img src='./multimedia/" + cover + "'/><h2>" + 
        title + "</h2><p><b>Autor:</b> " + author.getAttribute("nombre") + "</p>" +
        "<p><b>Editorial:</b> " + publisher + "</p>" +
        "<p><b>Fecha de salida:</b> " + date + "</p>" +
        "<p><b>Sinopsis:</b> " + summary + "</p>" +
        "<p><b>Puntuación:</b> " + score + "</p>" +
        "<p><b>ISBN:</b> " + isbn + "</p>" +
        "<p><b>Género:</b> " + subject + "</p>"
      )
  }

}

let xml = new XMLFile()