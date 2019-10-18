
document.head.insertAdjacentHTML('beforeend',`
<template id='book-search'>
    <style>
    :host{display: block;}
    input{width: 100%;}
    table{border-collapse: collapse;}
    td{ padding: 15px;}
    /* img{height: 80px;} */
    h3{ color: gray; }
    h5{color: silver;}
</style>
    
    <input type="search"/>
    <table id="result"></table>

</template>
`); 

window.customElements.define('book-search', class extends HTMLElement {
    constructor() {
        super();
        console.log('dommmm',this.innerHTML);
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#book-search').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x)}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
            connectedCallback(){
            this.$('input').addEventListener('search', e=>this.search(e.target.value));
        }
        async search(query){
            console.log('search',query);
            let results = await fetch(`https://www.googleapis.com/books/v1/volumes?q=`+query).then(x=>x.json());
            console.log('result',results);
            this.$('table').innerHTML='';
            for(let item of results.items)
                this.$('table').insertAdjacentHTML('beforeend', this.resultItem(item));
        }

        resultItem(x){
            let vol = x.volumeInfo;
            return `<tr> 
            <td> <img src='${vol.imageLinks.thumbnail}'/> </td> 
            <td>
                <h1>${vol.title}</h1> 
                <h2>${vol.subtitle ? vol.subtitle : ''}</h2> 
                <h3>${vol.authors}</h3> 
                <h4>${vol.publisher} </h4> 
                <h5>${vol.categories}</h5> 
                <h6>ISBN: ${vol.industryIdentifiers[0].identifier} </h6>
                <p>${vol.description}</p> 
            </td> 
        </tr>`;
        }
});