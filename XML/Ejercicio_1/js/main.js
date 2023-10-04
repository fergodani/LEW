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

  async readLibrary() {
    for (let i = 0; i < 2; i++) {
      let url_base = "./ebooks/book" + i + "/"
      const data = await this.readFile(url_base);
      console.log(data.getElementsByTagName('dc:Title'))
      const title = data.getElementsByTagName('dc:Title')[0].innerHTML
      const type = data.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML
      const author = data.firstElementChild.firstElementChild.firstElementChild.children[3].innerHTML
      const cover = url_base + data.firstElementChild.children[1].children[0].attributes.getNamedItem("href").value
      const sortedContent = data.firstElementChild.lastElementChild.children
      const content = data.firstElementChild.children[1].children
      const book = new Book(title, author, "", "", type, cover);
      book.setSortedContent(sortedContent);
      book.setContent(content);
      this.books.push(book);
    }
    this.drawBooks()
  }

  readFile(url_base) {
    return new Promise((resolve, reject) => {
      $.ajax({
        dataType: "xml",
        url: url_base + "book.xml",
        method: 'GET',
        success: function (data) {
          resolve(data);
        },
        error: function(error) {
          reject(error);
        }
      })
    })
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

  goBack() {
    $("main").show()
    $("header + button").hide()
    $("section").hide()
    $("a").hide()
    $("h1").html("Mi Biblioteca")
    $("input").show();
    $("button + h2").show();
  }

  async leerArchivoTexto(files) {
    console.log(files)
    const book = new Book();
    for (const file of files) {
      const data = await this.readBookFile(file);
      if(file.type == "text/xml") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml')
        const title = xmlDoc.getElementsByTagName('dc:Title')[0].innerHTML;
        const author = xmlDoc.getElementsByTagName('dc:Creator')[0].innerHTML;
        const subject = xmlDoc.getElementsByTagName('dc:Subject')[0].innerHTML;
        const date = xmlDoc.getElementsByTagName('dc:Date')[0].innerHTML;
        const type = xmlDoc.getElementsByTagName('dc:Type')[0].innerHTML;
        const sortedContent = xmlDoc.firstElementChild.lastElementChild.children
        const manifest = xmlDoc.firstElementChild.children[1].children;
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
    $("input").val('')
    this.books.push(book)
    this.drawBooks();
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
}

"use strict"
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
    $("h1").html(this.title)
    $("section").append("<img src='" + this.content.get("cover.jpg") + "' >")
    $("section").append(
      "<ul>" +
      "<li>Autor: " + this.author + "</li>" +
      "<li>Género: " + this.subject + "</li>" +
      "<li>Fecha de publicación: " + this.date + "</li>" +
      "<li>Tipo: " + this.type + "</li>" +
      "</ul>"
    )
  }

  readBook() {
    $("section").html("<ul></ul>")
    $("section").show()
    $("header + button").show()
    $("input").hide();
    $("main").hide()
    $("button + h2").hide();
    $("a").show()
    $("h1").html(this.title)

    for (let item of this.sortedContent) {
      const id = item.attributes[0].value
      const src = this.manifest.namedItem(id).attributes[1].value
      const type = this.manifest.namedItem(id).attributes[2].value
      if (type == "image/jpg") {
        $("section").append("<img src='" + this.content.get(src) + "' >")
      } else {
        $("section ul").append("<li><a href=#" + id + ">" + id + "</a></li>")
              $("section").append("<h2 id=" + id + ">" + id + "</h2>")
              $("section").append(
                "<p>" + this.content.get(src) + "</p>"
              )
      }
    }
  }
}

let xml = new XMLFile()
//xml.readLibrary()