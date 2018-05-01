var Income= function(incomeDesc,incomeValue){
    this.incomeDesc= incomeDesc;
    this.incomeValue=incomeValue;

}
var Expense= function(expenseDesc,expenseValue){
    this.expenseDesc= expenseDesc;
    this.expenseValue=expenseValue;
    
    }
    var UIController= (function(){  // is IIFE, will handle ui manipulation.

    })();

    var budgetController= (function(){ // is IIFE, will handle data manipulation.

    })();

    var globalAppController=(function(UICtrl,budgetCtrl){ //will provide connection to ui and budget                                                                           controller.
   
    })(UIController,budgetController);

    var totalIncome=0,totalExpense=0,availableBalance=0,budgetExpensePercentage=0;
    (function(){
        document.querySelector(".budget__income--value").textContent= "+" + totalIncome;
        document.querySelector(".budget__expenses--value").textContent="-" + totalExpense;
        document.querySelector(".budget__value").textContent= "+" + availableBalance;
        document.querySelector(".budget__expenses--percentage").textContent= budgetExpensePercentage+ "%";
        var currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
          ];

        document.querySelector(".budget__title--month").textContent= monthNames[currentDate.getMonth()] + "," + currentDate.getFullYear();
        
        
        
    })();

document.querySelector(".add__btn").addEventListener("click",addBudget);





function addBudget(){
    var currentIncome,currentExpense;
    var budgetObject;
    var amount=document.querySelector(".add__value").value;
    var amountdescription=document.querySelector(".add__description").value;
    var budgetType=document.querySelector(".add__type").value;

   if(budgetType==="inc"){
    budgetObject= new Income("amountdescription",parseInt(amount));
    addIncome(budgetObject);
 
   }
   else if(budgetType==="exp"){
 budgetObject= new Expense("amountdescription",parseInt(amount));
 addExpense(budgetObject);
   }
   
}
document.addEventListener("keypress",function(event){
if(event.keyCode===13 || event.which===13){
    addBudget();
}
})

function addIncome(budgetObject){
   
    currentIncome = budgetObject.incomeValue;
    totalIncome= totalIncome + currentIncome;
    availableBalance=availableBalance+ currentIncome;
    document.querySelector(".budget__income--value").textContent= "+" + totalIncome;
    if(availableBalance>0){
       document.querySelector(".budget__value").textContent="+" + availableBalance;
    } 
    else{
       document.querySelector(".budget__value").textContent= "-" +availableBalance;
    }
    var newDiv="<div>100</div>";

    document.querySelector(".income__list").innerHTML=newDiv;
}
    
function addExpense(budgetObject){
    currentExpense= budgetObject.expenseValue;
    totalExpense = totalExpense+ currentExpense;
    availableBalance= availableBalance-currentExpense; 
    document.querySelector(".budget__expenses--value").textContent="-" + totalExpense;
    if(availableBalance>0){
       document.querySelector(".budget__value").textContent="+" + availableBalance;
    }
    else{
       document.querySelector(".budget__value").textContent= availableBalance;
    }
}