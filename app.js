

//**********************UI CONTROLLER*************************************** */

var UIController= (function(){  // is IIFE, will handle ui manipulation.

    var DOMstrings={
        inputType:".add__type",
        inputDesc:".add__description",
        inputAmount:".add__value",
        addButton:".add__btn",
        incomeContainer:".income__list",
        expenseContainer:".expenses__list",
        budgetLabel:".budget__value",
        incomeLabel:".budget__income--value",
        expenseLabel:".budget__expenses--value",
        expensepercentageLabel:".budget__expenses--percentage",
        dateLabel:".budget__title--month"
    }

    return{
        
     getInput:function(){
     return{
         amount:parseFloat(document.querySelector(DOMstrings.inputAmount).value),
         amountdescription:document.querySelector(DOMstrings.inputDesc).value,
         budgetType:document.querySelector(DOMstrings.inputType).value
     }
    
 },
 getDomstrings:function(){
     return DOMstrings;
 },

 addBudgetObjectToList:function(budgetObject,budgetType){
     var html,newHtml,element;
     
     //create html string with placeholder text
     if(budgetType==="inc"){
        element=DOMstrings.incomeContainer;
        html='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
     }
     else if(budgetType==="exp"){
        element=DOMstrings.expenseContainer;
         html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
     }
     //replace placeholder text with actual value.
     newHtml=html.replace("%id%" , budgetObject.id);
     newHtml=newHtml.replace("%description%", budgetObject.desc);
     newHtml=newHtml.replace("%value%", budgetObject.value);
 
     //Insert the html text to the list
     document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);

 },
 clearFields:function(){
     var fields,fieldArr;
     fields=document.querySelectorAll(DOMstrings.inputDesc + "," + DOMstrings.inputAmount) ;//return list
    fieldArr=Array.prototype.slice.call(fields); //change list to array
    
    fieldArr.forEach(function(current,index,array){
        current.value="";
    });
    fieldArr[0].focus();  
    
 },
 displayUpdatedBudget:function(obj){
     if(obj.budget>0){
        document.querySelector(DOMstrings.budgetLabel).textContent="+" +obj.budget;
     }
     else{
        document.querySelector(DOMstrings.budgetLabel).textContent=obj.budget;
     }
    if(obj.income>0){
        document.querySelector(DOMstrings.incomeLabel).textContent="+"+obj.income;
    }
    else{
        document.querySelector(DOMstrings.incomeLabel).textContent=obj.income;
    }
    if(obj.expense>0){
        document.querySelector(DOMstrings.expenseLabel).textContent="-"+obj.expense;
    }
    else{
        document.querySelector(DOMstrings.expenseLabel).textContent=obj.expense;
    }
 
    if(obj.expensePercentage >0){
        document.querySelector(DOMstrings.expensepercentageLabel).textContent=obj.expensePercentage + "%";
    }
    else{
        document.querySelector(DOMstrings.expensepercentageLabel).textContent="---";
    }
    
 }
    };

})();

//**********************BUDGET CONTROLLER*************************************** */

var budgetController= (function(){ // is IIFE, will handle data manipulation.
    var Income= function(id,desc,value){
        this.id=id;
        this.desc= desc;
        this.value=value;
    
    }
    var Expense= function(id,desc,value){
        this.id=id;
        this.desc= desc;
        this.value=value;
        
        }
        var calculateTotalBudget=function(type){
            var sum=0;
            if(type==="inc"){

                budgetData.allItems.allIncome.forEach(function(current){
                   sum+=current.value;
                   budgetData.totals.inc=sum;
                })
              }else if(type==="exp"){

       budgetData.allItems.allExpense.forEach(function(current){
        sum+=current.value;
        budgetData.totals.exp=sum;
                })
                 }

        }

        var budgetData = {       
            allItems:{
                 allExpense:[],
                 allIncome:[]
            },
            totals:{
             exp:0,
              inc:0
              
            },
            budget:0,
            expensePercentage:-1
        };

        return {

            addItem:function(type,desc,val){
                var budgetObject,ID;
                ID=0;
                if(type==="inc"){
                    
                    if(budgetData.allItems.allIncome.length>0){
                        ID=budgetData.allItems.allIncome[budgetData.allItems.allIncome.length-1].id+1;
                    }
                    else{
                        ID=0;
                    }
                  
                    budgetObject= new Income(ID,desc,val);
                    budgetData.allItems.allIncome.push(budgetObject);
                   }

                   else if(type==="exp"){
                       if(budgetData.allItems.allExpense.length>0){
                        ID=budgetData.allItems.allExpense[budgetData.allItems.allExpense.length-1].id+1;
                       }
                       else{
                        ID=0;
                    }
                
                 budgetObject= new Expense(ID,desc,val);
                 budgetData.allItems.allExpense.push(budgetObject);
                 
                   }
                   return budgetObject;
            },
           getBudget:function(type, budgetObject){
               var budgetvalue;
        if(type==="inc"){
             budgetData.totals.inc= budgetData.totals.inc+budgetObject.amount;
             budgetvalue=budgetData.totals.inc;
         }
         else if(type==="exp"){

            budgetData.totals.exp=budgetData.totals.exp+budgetObject.amount;
            budgetvalue=budgetData.totals.exp;
}
return budgetvalue;
            },
            
            calculateBudget:function(){

                //calculate total income and expense
                calculateTotalBudget("inc");
                calculateTotalBudget("exp");
                //calculate budget:income-expense
             budgetData.budget=budgetData.totals.inc-budgetData.totals.exp;
                //calculate expense percentage
                if(budgetData.totals.inc>0){
                    budgetData.expensePercentage= Math.round((budgetData.totals.exp / budgetData.totals.inc)*100);
                }else{
                    budgetData.expensePercentage= -1;
                }
              
            
            },
            getBudget:function(){
                return{
                    income:budgetData.totals.inc,
                    expense:budgetData.totals.exp,
                    budget:budgetData.budget,
                    expensePercentage:budgetData.expensePercentage 
                }
            }
        }
})();


//**********************GLOBAL CONTROLLER*************************************** */

var globalAppController=(function(UICtrl,budgetCtrl){ //will provide connection to ui and budget                      var totalIncome=0,totalExpense=0,availableBalance=0,budgetExpensePercentage=0;                                                        controller.
    var setUpEventListeners=function(){
        var DOM= UICtrl.getDomstrings();
       
        document.querySelector(DOM.addButton).addEventListener("click",addBudget);
        document.addEventListener("keypress",function(event){
            if(event.keyCode===13 || event.which===13){
                addBudget();
            }
            })
    };
var setDate= function(){
    
    var DOM= UICtrl.getDomstrings();
    var currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
          ];
          
        document.querySelector(DOM.dateLabel).textContent= monthNames[currentDate.getMonth()] + "," + currentDate.getFullYear();
        
}
    
 var updateBudget= function(){

// calculate the budget
budgetCtrl.calculateBudget();
//return the budget
var receivedBudget=budgetCtrl.getBudget();
// display the budget
UICtrl.displayUpdatedBudget(receivedBudget);
console.log(receivedBudget);
 }
   

    var addBudget=function (){

        //get the data from the fields
       var inputData= UICtrl.getInput();
       
if(inputData.amountdescription!="" && !isNaN(inputData.amount) && inputData.amount>0 ){
//Add the data to the budget controller
var budgetData = budgetCtrl.addItem(inputData.budgetType,inputData.amountdescription,inputData.amount);
      
//Add budget data to the UI, i.e income or expense list
var itemToAdd=UICtrl.addBudgetObjectToList(budgetData,inputData.budgetType);

// clear input fields
UICtrl.clearFields();

//calculate budget for income and expense
updateBudget();
//var budgetCalculated=budgetCtrl.getBudget(inputData.budgetType,budgetData);
//console.log("budget calculated:"+budgetCalculated);
}
else{
    UICtrl.clearFields();
}
       
    }



    return{
        init:function(){
            UICtrl.displayUpdatedBudget({
                income:0,
                expense:0,
                budget:0,
                expensePercentage:0 
            });
            setDate();
            setUpEventListeners();
            
            console.log("event started");
        }
    };

   
})(UIController,budgetController);


globalAppController.init();


