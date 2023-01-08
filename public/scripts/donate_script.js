document.getElementById('heart').style.display='none';
document.getElementById('liver').style.display='none';
document.getElementById('lung').style.display='none';
const organs=['heart','liver','lung','kidney'];
function GetSelectedTextValue(organ) {
    var selectedText = organ.options[organ.selectedIndex].innerHTML;
    var selectedValue = organ.value;
    document.getElementById(selectedValue).style.display='block';
    for (let i = 0; i < organs.length; i++) {
        if(organs[i]!=selectedValue)
            document.getElementById(organs[i]).style.display='none';
      }

}