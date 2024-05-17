const modalProduct = new bootstrap.Modal(document.getElementById('modalProduct'))
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}
on(document, 'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode
    id_editar.value = fila.children[0].innerHTML
    title_editar.value = fila.children[3].innerHTML
    price_editar.value = fila.children[5].innerHTML
    //show all children inner html
    for (let i = 0; i < fila.children.length; i++) {
        console.log(i)
        console.log(fila.children[i].innerHTML)
    }

    modalProduct.show()
})