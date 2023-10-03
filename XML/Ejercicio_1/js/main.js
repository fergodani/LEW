"use strict";
class XMLFile {
  constructor() {
    this.books = [];
    this.index = 0;
    this.pagesOrdered = null;
    this.content = null;
    this.bookIndex = 1;
  }

  createElement(type, text) {
    var element = document.createElement(type);
    element.innerHTML = text;
    $("h5").text(text);
  }

  verXML(text) {
    this.createElement("p", text)
  }

  async readLibrary() {
    for (let i = 0; i < 2; i++) {
      let url_base = "./ebooks/book" + i + "/"
      const data = await this.readFile(url_base);
      const title = data.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
      const type = data.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML
      const author = data.firstElementChild.firstElementChild.firstElementChild.children[3].innerHTML
      const cover = url_base + data.firstElementChild.children[1].children[0].attributes.getNamedItem("href").value
      const book = new Book(title, author, "", "", type, cover);
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
    this.books.forEach((book) => {
      $("main").append(
        "<article><img src='" + book.cover + "' /><h2>" + book.title + "</h2><p>" + book.creator + "</p><button onclick='xml.readBook(1)'>Leer</button></article>"
      )
    })
  }

  readBook(index) {
    $("section").html("")
    $("section").show()
    $("h1 + button").show()
    $("main").hide()
    $("a").show()

    this.bookIndex = index;

    $.ajax({
      dataType: "xml",
      url: "./ebooks/book" + index + "/book.xml",
      method: 'GET',
      async: false,
      context: this,
      success: function (datos) {
        const title = datos.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
        this.pagesOrdered = datos.firstElementChild.lastElementChild.children
        this.content = datos.firstElementChild.children[1].children

        $("h1").html(title)

        this.readcontent();
      }
    })
  }

  readcontent() {
    const item = this.pagesOrdered[this.index];
    const id = item.attributes[0].value
    const src = this.content.namedItem(id).attributes[1].value
    const type = this.content.namedItem(id).attributes[2].value
    if (type == "image/jpg") {
      $("section").append("<img src='./ebooks/book" + this.bookIndex + "/" + src + "' >")
      this.readcontent(++this.index)
    } else {
      $.ajax({
        dataType: "text",
        url: "./ebooks/book" + this.bookIndex + "/" + src,
        method: 'GET',
        async: false,
        success: function (element) {
          if (type == "text/plain") {
            $("section").append("<h2>" + id + "</h2>")
            $("section").append(
              "<p>" + element + "</p>"
            )
            if (this.index != 0)
              $("section").append("<button onclick='xml.readcontent(" + (xml.index - 1) + ")' >Anterior</button>")
            $("section").append("<button onclick='xml.readcontent(" + ++xml.index + ")' >Siguiente</button>")
          }
        }
      })
    }
  }


  goBack() {
    $("main").show()
    $("h1 + button").hide()
    $("section").hide()
    $("h1").html("Librería")
  }

  leerArchivoTexto(files) {
    //Solamente toma un archivo
    //var archivo = document.getElementById("archivoTexto").files[0];
    var archivo = files[0];
    var contenido = document.getElementById("contenidoArchivo");
    var areaVisualizacion = document.getElementById("areaTexto");
    var errorArchivo = document.getElementById("errorLectura");

    contenido.innerText = "Contenido del archivo de texto:"
    //Solamente admite archivos de tipo texto
    var tipoTexto = /text.*/;
    if (archivo.type.match(tipoTexto)) {
      var lector = new FileReader();
      lector.onload = function (evento) {
        //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
        //La propiedad "result" es donde se almacena el contenido del archivo
        //Esta propiedad solamente es válida cuando se termina la operación de lectura
        //areaVisualizacion.innerText = lector.result;
        const xml = new XMLFile()
        console.log(lector.result)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(lector.result, 'application/xml');
        var str = (new XMLSerializer()).serializeToString(xmlDoc)
        xml.verXML(str)
        console.log(str)
        console.log("Total nodos: " + $('*', lector.result).length)
        $.ajax({
          dataType: "xml",
          url: "./ebooks/book1/book1.xml",
          method: 'GET',
          async: false,
          success: function (datos) {
            console.log(datos)
            console.log("Total nodos: " + $('*', datos).length)
            console.log("Título: " + $('dc:Title', datos))
            console.log("Item: " + $('item', datos).attr("cover"))
          }
        })
      }
      lector.readAsText(archivo);
    }
    else {
      errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
    }
  };
}

class Book {
  constructor(title, creator, subject, date, type, cover) {
    this.title = title;
    this.creator = creator;
    this.subject = subject;
    this.date = date;
    this.type = type;
    this.cover = cover;
  }
}

let xml = new XMLFile()
xml.readLibrary()