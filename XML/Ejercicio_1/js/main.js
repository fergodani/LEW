"use strict";
class XMLFile {
  constructor() {

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
    $.ajax({
      dataType: "xml",
      url: "./ebooks/book1/book1.xml",
      method: 'GET',
      success: function(datos) {
        const title = datos.firstElementChild.firstElementChild.firstElementChild.children[0].innerHTML
        const type = datos.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML
        const author = datos.firstElementChild.firstElementChild.firstElementChild.children[3].innerHTML
        const cover = "./ebooks/book1/" + datos.firstElementChild.children[1].children[0].attributes.getNamedItem("href").value
        $("main").html(
          "<article><img src='"+cover+"' /><h2>" + title + "</h2><p>" + author +"</p></article>"
        )
        $("article").after(
          "<article><img src='"+cover+"' /><h2>" + title + "</h2><p>" + author +"</p></article>"
        )
      }
    })
  
  }

  leerArchivoTexto(files) 
  { 
      //Solamente toma un archivo
      //var archivo = document.getElementById("archivoTexto").files[0];
      var archivo = files[0];
      var contenido = document.getElementById("contenidoArchivo");
      var areaVisualizacion = document.getElementById("areaTexto");
      var errorArchivo = document.getElementById("errorLectura");
    
      contenido.innerText="Contenido del archivo de texto:"
      //Solamente admite archivos de tipo texto
      var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
        {
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
              success: function(datos) {
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

 



