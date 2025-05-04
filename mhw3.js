
/* Per il menu */
let apri_menu = document.querySelector("#apri_menu");
function scorrimenu(event){
  let menu_pt1 = document.querySelector(".navbar-menu");
  let menu_pt2 = document.querySelector(".navbar-accesso");
  let mostralo = true;
  for(let classe of menu_pt1.classList){
    if("invisibile_mobile" === classe){
      menu_pt1.classList.remove("invisibile_mobile"); /* 4) modificare dinamicamente la classe degli elementi agendo sulla proprietà classList; */
      menu_pt2.classList.remove("invisibile_mobile")  /* 5) mostrare o nascondere dinamicamente parti della pagina assegnando o rimuovendo classi CSS che modificano la proprietà display; */
      mostralo = false;
      break
    }
  }
  if(mostralo === true){
    menu_pt1.classList.add("invisibile_mobile");
    menu_pt2.classList.add("invisibile_mobile");
  }
}
apri_menu.addEventListener("click", scorrimenu); /* 1) usare addEventListener() per gestire eventi nella pagina; */

/* Per le foto */
let n_foto = 1
let linkfoto = ["https://cdn-images.dzcdn.net/images/cover/9302627a46a9cd026a87a62ae37a323f/1900x1900-000000-80-0-0.jpg",
            "https://cdn-images.dzcdn.net/images/cover/34a4a702b269e61bdceaa2310c74e1d2/1900x1900-000000-80-0-0.jpg",
            "https://cdn-images.dzcdn.net/images/cover/3e367415f942f9cf2b8d74e3139caa9f/1900x1900-000000-80-0-0.jpg",
            "https://cdn-images.dzcdn.net/images/artist/83cfc9a714e2dca84dfa1a0c4f380110/1900x1900-000000-80-0-0.jpg"
  ]
function scorrifoto(event){
  const box_foto = event.currentTarget;
  box_foto.src = linkfoto[n_foto]
  n_foto++;
  if(n_foto === linkfoto.length){
    n_foto=0;
  }
}
function caricaFoto(event){
  // so che element.style o element.style.* sono da evitare, in questo caso li utilizzo solo per dimostrare al volo la capacità di utilizzo di document.createElement() e element_img.src
  let cornice_foto = document.querySelector("#con_js");
  let h1_foto = document.createElement("h1"); /* 2) usare document.createElement() per creare dinamicamente oggetti HTML a partire da contenuti definiti in JavaScript; */
  h1_foto.textContent = "Foto (cliccare sulle foto per cambiarle)";
  h1_foto.style = "text-align: center; margin: 10px 0px; gowun-batang-regular";
  cornice_foto.appendChild(h1_foto);
  let box_foto = document.createElement("img");
      /* 3) modificare dinamicamente l’URL di un’immagine tramite l’attributo src; */
      // cambiare una o più immagini della pagina quando l’utente clicca o si muove sopra certi elementi;
  box_foto.src = "https://cdn-images.dzcdn.net/images/cover/9302627a46a9cd026a87a62ae37a323f/1900x1900-000000-80-0-0.jpg";
  box_foto.classList.add("box_foto");
  box_foto.id = "foto_modificabili";
  cornice_foto.appendChild(box_foto);
  event.currentTarget.removeEventListener("click", caricaFoto); 

  box_foto.addEventListener("click", scorrifoto);
}
let button_aggiungi_elementi = document.querySelector("#foto");
button_aggiungi_elementi.addEventListener("click", caricaFoto);

/* 6) utilizzare attributi data-*    */
function ingrandisci_bordo_ico(event){
  event.currentTarget.dataset.poggiaMouse = 1;
}
function riduci_bordo_ico(event){
  event.currentTarget.dataset.poggiaMouse = 0;
}
const poggia_mouse = document.querySelector(".hamburger[data-poggia-mouse]");
poggia_mouse.addEventListener("mouseover", ingrandisci_bordo_ico);
poggia_mouse.addEventListener("mouseout", riduci_bordo_ico);








////////////////// MHW3 API /////////////////////////

// API OAuth2 per spotify
let token;
const client_id = "secret";
const client_secret = "secret";
fetch("https://accounts.spotify.com/api/token", {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic "+btoa(client_id+":"+client_secret)
        }
    }
)
.then(
    function(response){
        return response.json();         // CONVERTE LE RISPOSTA IN JSON E LA RESTITUISCE IN MODO ASINCRONO. la prima volta usando .then faremmo in modo che appena la risposta arrivi, noi con il comando response.json() la convertiremmo in json e la restituiremmo per poter quindi essere utilizzabile nella seconda .then, quindi con il secondo .then potremmo andare a leggere il json stesso che verrà passato come parametro alla sua funzione2 
    }
)
.then(
    function(datiJson){                 // grazie al comando response.json() precedentemente usato, ed a questa seconda .then allora dentro al parametro datiJson avremmo il vero e proprio json
      token = datiJson;
      fetch("https://api.spotify.com/v1/artists/2NzXkzdZYosTDh8OJOKiMb/top-tracks", {
          headers: {
              "Authorization": "Bearer "+token.access_token
          }
        })
        .then(
          function(response){
            return response.json(); 
          }
        )
        .then(
          function(datiJson){  
            const div_spotify = document.querySelector("#spotify");
            for(let canzone of datiJson.tracks){
              let a = document.createElement("a");
              a.href = canzone.external_urls.spotify;
              a.textContent = canzone.name;
              div_spotify.appendChild(a);
            }
          }
        )
    }
)

// API REST per chatbot OpenAI
let messaggi = [
                    {
                        role: "system",
                        content: "Tu sei un assistente per un sito che vende lezioni di canto"
                    },
                    {
                        role: "assistant",
                        content: "Ciao come posso aiutarti?"
                    }
                ];
function chatta(){
  const boxMessaggi = document.querySelector("#messaggi");
  const nuovoMessaggioUtente = document.querySelector("#chat textarea").value;
  messaggi.push({
                    role: "user",
                    content: nuovoMessaggioUtente
                });
  const elementoMsgUtente = document.createElement("h4");
  elementoMsgUtente.classList.add("utente");
  elementoMsgUtente.textContent = nuovoMessaggioUtente;
  boxMessaggi.appendChild(elementoMsgUtente);

  // USA API REST
  let rispostaAssistente;
  fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer secret"
      
      },
      body: JSON.stringify({
          model: "gpt-4.1-nano",
          messages: messaggi
      })
  })
  .then(
      function(response){
          return response.json();         
      }
  )
  .then(
      function(datiJson){ 
          rispostaAssistente = datiJson;  
          let role = rispostaAssistente.choices[0].message.role;
          messaggi.push({
              role: rispostaAssistente.choices[0].message.role,
              content: rispostaAssistente.choices[0].message.content
          })
          const elementoMsgAssistente = document.createElement("h4");
          elementoMsgAssistente.classList.add("assistenza");
          elementoMsgAssistente.textContent = rispostaAssistente.choices[0].message.content;
          boxMessaggi.appendChild(elementoMsgAssistente);
      }
  )
}

const invia = document.querySelector("#chat button");
invia.addEventListener("click", chatta);

// Chiusura - Apertura Assistente
const chiudiAssistente = document.querySelector("#chiudiAssistente");
const icoAssistente = document.querySelector("#icoAssistente");
  // Chiusura
function chiudi(){
  const assistente = document.querySelector("#assistente");
  assistente.classList.remove("assistenteAperto");
  assistente.classList.add("assistenteChiuso");
  const assistenteFiglio = document.querySelector("#assistente-figlio");
  assistenteFiglio.style.display = "none";
  icoAssistente.style.display = "inline-block";
}
chiudiAssistente.addEventListener("click", chiudi);

// Apertura Assistente
function apri(){
  icoAssistente.style.display = "none";
  const assistenteFiglio = document.querySelector("#assistente-figlio");
  assistenteFiglio.style.display = "flex";
  const assistente = document.querySelector("#assistente");
  assistente.classList.remove("assistenteChiuso");
  assistente.classList.add("assistenteAperto");
}
icoAssistente.addEventListener("click", apri);


