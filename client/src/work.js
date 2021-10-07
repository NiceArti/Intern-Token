var addr = document.getElementById("address");
var val = document.getElementById("value");

var mint = document.getElementById("mint");
var burn = document.getElementById("burn");
var mintVal = document.getElementById("mintVal");
var burnVal = document.getElementById("burnVal");


function enableMint()
{
    if(mintVal.value.length != 0)
    {
        mint.disabled = false;
    }
    else
    {
        mint.disabled = true;
    }
}

function enableBurn()
{
    if(burnVal.value.length != 0)
        burn.disabled = false;
    else 
        burn.disabled = true;
}