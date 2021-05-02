const Modal = {
    //** Adds the 'active' class to the modal */
    open() {
        document.querySelector('.modal-overlay').classList.add('active');

    },

    //** Remove the 'active' class to the modal */
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

