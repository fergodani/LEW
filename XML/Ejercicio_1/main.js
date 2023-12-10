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

  goBack() {
    $("main").show()
    $("header + button").hide()
    $("aside").hide()
    $("section").hide()
    $("a").hide()
    $("h1").html("Mi Biblioteca")
    $("input").show();
    $("section").remove();
    $("button + h2").show();
  }

  async leerArchivoTexto(files) {
    const book = new Book();
    let isXML = false;
    let isAllContent = false;
    for (const file of files) {
      const data = await this.readBookFile(file);
      if(file.type == "text/xml") {
        isXML = true;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml')
        const title = xmlDoc.getElementsByTagName('dc:Title')[0].innerHTML;
        const author = xmlDoc.getElementsByTagName('dc:Creator')[0].innerHTML;
        const subject = xmlDoc.getElementsByTagName('dc:Subject')[0].innerHTML;
        const date = xmlDoc.getElementsByTagName('dc:Date')[0].innerHTML;
        const type = xmlDoc.getElementsByTagName('dc:Type')[0].innerHTML;
        const sortedContent = xmlDoc.firstElementChild.lastElementChild.children
        const manifest = xmlDoc.firstElementChild.children[1].children;

        if (manifest.length == files.length - 1)
          isAllContent = true;

        book.setTitle(title);
        book.setAuthor(author);
        book.setSubject(subject);
        book.setDate(date);
        book.setType(type);
        book.setSortedContent(sortedContent);
        book.setManifest(manifest);
      } else if (file.type == "text/plain" || file.type == "image/jpeg") {
          book.content.set(file.name, data)
      }
    }
    if (!isXML || !isAllContent) {
      $("main").after("<p>Por favor, sube los libros correctamente</p>")
    }else {
      $("main + p").remove()
      $("input").val('')
      this.books.push(book)
      this.drawBooks();
    }
    
  };

  readBookFile(file) {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = function (event) {
        resolve(event.target.result)
      }
      if(file.type == "image/jpeg")
        lector.readAsDataURL(file)
      else
        lector.readAsText(file)
    })
  }

  drawBooks() {
    $("main").html("");
    let index = 0;
    this.books.forEach((book) => {
      const cover = book.content.get("cover.jpg")
      $("main").append(
        "<article><img alt='" + cover + "' src='" + cover + "'/><h2>" + 
        book.title + "</h2><p>" + book.author + 
        "</p><button onclick='xml.books["+index+
        "].viewDetails()'>Detalles</button><button onclick='xml.books["+index+
        "].readBook("+index+")'>Leer</button></article>"
      )
      index++;
    })
  }
}

class Book {

  constructor() {
    this.title = ""
    this.author = ""
    this.subject = ""
    this.date = ""
    this.type = ""
    this.cover = ""
    this.sortedContent = null
    this.manifest = null
    this.content = new Map();
    this.state = "Sin leer";
  }

  setTitle(title) {
    this.title = title;
  }

  setAuthor(author) {
    this.author = author;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setDate(date) {
    this.date = date;
  }

  setType(type) {
    this.type = type;
  }

  setCover(cover) {
    this.cover = cover;
  }

  setSortedContent(sortedContent) {
    this.sortedContent = sortedContent;
  }

  setContent(content) {
    this.content = content;
  }

  setManifest(manifest) {
    this.manifest = manifest
  }

  viewDetails() {
    $("header + button").show()
    $("section").html("");
    $("section").show()
    $("main").hide()
    $("input").hide();
    $("button + h2").hide();
    $("aside").after("<section></section>")
    $("main + p").remove()
    const cover = this.content.get("cover.jpg")
    $("section").append("<img alt='" + cover + "' src='" + cover + "' >")
    $("section").append(
      "<h2>" + this.title + "</h2>" +
      "<p><b>Autor:</b> " + this.author + "</p>" +
      "<p><b>Género:</b> " + this.subject + "</p>" +
      "<p><b>Fecha de publicación:</b> " + this.date + "</p>" +
      "<p><b>Tipo:</b> " + this.type + "</p>"
    )
  }

  readBook() {
    $("aside").html("<ul></ul>")
    $("section").empty()
    $("header + button").show()
    $("section").show()
    $("aside").show()
    $("input").hide();
    $("main").hide()
    $("button + h2").hide();
    $("a").show()
    $("h1").html(this.title)
    $("aside").after("<section></section>")
    $("main + p").remove()

    for (let item of this.sortedContent) {
      const id = item.attributes[0].value
      const src = this.manifest.namedItem(id).attributes[1].value
      const type = this.manifest.namedItem(id).attributes[2].value
      if (type == "image/jpg") {
        $("section").append("<img alt='" + src + "' src='" + this.content.get(src) + "' >")
      } else {
        $("aside ul").append("<li><a href=#" + id + ">" + id + "</a></li>")
              $("section").append("<h2 id=" + id + ">" + id + "</h2>")
              $("section").append(
                "<p>" + this.content.get(src) + "</p>"
              )
      }
    }
  }
}

let xml = new XMLFile()