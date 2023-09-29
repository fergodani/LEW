"use strict";
class XMLFile {
  constructor() {
    this.books = []
  }

  createElement(type, text) {
    var element = document.createElement(type);
    element.innerHTML = text;
    $("h5").text(text);
  }

  verXML(text) {
    this.createElement("p", text)
  }

  readLibrary() {
    $("h1 + button").hide()
    $("a").hide()
    $.ajax({
      dataType: "xml",
      url: "./ebooks/book1/book.xml",
      method: 'GET',
      success: function (datos) {
        const title = datos.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
        const type = datos.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML
        const author = datos.firstElementChild.firstElementChild.firstElementChild.children[3].innerHTML
        const cover = "./ebooks/book1/" + datos.firstElementChild.children[1].children[0].attributes.getNamedItem("href").value
        $("main").append(
          "<article><img src='" + cover + "' /><h2>" + title + "</h2><p>" + author + "</p><button onclick='xml.readBook(1)'>Leer</button></article>"
        )
      }
    })
    $.ajax({
      dataType: "xml",
      url: "./ebooks/book2/book.xml",
      method: 'GET',
      success: function (datos) {
        const title = datos.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
        const type = datos.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML
        const author = datos.firstElementChild.firstElementChild.firstElementChild.children[3].innerHTML
        const cover = "./ebooks/book2/" + datos.firstElementChild.children[1].children[0].attributes.getNamedItem("href").value
        $("main").append(
          "<article><img src='" + cover + "' /><h2>" + title + "</h2><p>" + author + "</p><button onclick='xml.readBook(2)'>Leer</button></article>"
        )
      }
    })
  }

  readBook(index) {
    $("section").html("")
    $("section").show()
    $("h1 + button").show()
    $("main").hide()
    $("a").show()
    $.ajax({
      dataType: "xml",
      url: "./ebooks/book" + index + "/book.xml",
      method: 'GET',
      async: false,
      success: function (datos) {
        const title = datos.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
        const pagesOrdered = datos.firstElementChild.lastElementChild.children
        const content = datos.firstElementChild.children[1].children

        $("h1").html(title)

        for (let item of pagesOrdered) {
          const id = item.attributes[0].value
          const src = content.namedItem(id).attributes[1].value
          const type = content.namedItem(id).attributes[2].value
          if (type == "image/jpg") {
            $("section").append("<img src='./ebooks/book" + index + "/" + src + "' >")
          } else {
            $.ajax({
              dataType: "text",
              url: "./ebooks/book" + index + "/" + src ,
              method: 'GET',
              async: false,
              success: function (element) {
                console.log(element)
                if (type == "text/plain") {
                  $("section").append("<h2>" + id + "</h2>")
                  $("section").append(
                    "<p>" + element + "</p>"
                  )
                }
              }
            })
          }
        }
      }
    })
  }

  goBack(){
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

let xml = new XMLFile()
xml.readLibrary()





