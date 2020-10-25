function valideerFormulier() {
    let invoerveld = document.forms.myForm.voornaam;
    if (invoerveld.value == "") {
        voornaam.style.borderColor = "red";
        return false;
    }
    invoerveld = document.forms.myForm.gebruikersnaam;
    if (invoerveld.value == "") {
        gebruikersnaam.style.borderColor = "red";
        return false;
    }
    invoerveld = document.forms.myForm.achternaam;
    if (invoerveld.value == "") {
        achternaam.style.borderColor = "red";
        return false;
    }
}
