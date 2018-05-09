

//**********************UI CONTROLLER*************************************** */

var UIController = (function () {  // is IIFE, will handle ui manipulation.

    var DOMstrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputAmount: ".add__value",
        addButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        expensepercentageLabel: ".budget__expenses--percentage",
        dateLabel: ".budget__title--month",
        container: ".container",
        expensePercentage: ".item__percentage"
    }
    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        num = Math.abs(num); //change negative to positive
        num = num.toFixed(2); // add two decimal point at the end
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        //num=num.toLocaleString('en-US', {minimumFractionDigits: 2});
        int = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (type === "exp" ? "-" : "+") + int + "." + dec;
    }

    return {

        getInput: function () {
            return {
                amount: parseFloat(document.querySelector(DOMstrings.inputAmount).value),
                amountdescription: document.querySelector(DOMstrings.inputDesc).value,
                budgetType: document.querySelector(DOMstrings.inputType).value
            }

        },
        getDomstrings: function () {
            return DOMstrings;
        },

        addBudgetObjectToList: function (budgetObject, budgetType) {
            var html, newHtml, element;

            //create html string with placeholder text
            if (budgetType === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (budgetType === "exp") {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace placeholder text with actual value.
            newHtml = html.replace("%id%", budgetObject.id);
            newHtml = newHtml.replace("%description%", budgetObject.desc);
            newHtml = newHtml.replace("%value%", formatNumber(budgetObject.value, budgetType));

            //Insert the html text to the list
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },
        deleteBudgetObjectFromList: function (selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
          

        },
        clearFields: function () {
            var fields, fieldArr;
            fields = document.querySelectorAll(DOMstrings.inputDesc + "," + DOMstrings.inputAmount);//return list
            fieldArr = Array.prototype.slice.call(fields); //change list to array

            fieldArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldArr[0].focus();

        },
        displayUpdatedBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.income, "inc");
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.expense, "exp");
            if (obj.expensePercentage > 0) {
                document.querySelector(DOMstrings.expensepercentageLabel).textContent = obj.expensePercentage + "%";
            }
            else {
                document.querySelector(DOMstrings.expensepercentageLabel).textContent = "----";
            }

        },
        displayPercentages: function (percentArray) {
            console.log(percentArray);
            var fields = document.querySelectorAll(DOMstrings.expensePercentage);
            for (var i = 0; i < fields.length; i++) {
                if (percentArray[i] > 0) {
                    fields[i].textContent = percentArray[i] + "%";
                }
                else {
                    fields[i].textContent = "----"
                }

            }
            /*var nodeListForEach=function(list,callback){
                console.log(1);
            for (var i=0;i<list.length;i++){
                callback(list[i],i);
            }
            }
            
             nodeListForEach(fields,function(current, index){
                 console.log(current,index);
                 if(percentArray[index]>0){
                     current.textContent = percentArray[index] + "%"
                 }
                 else{
                    current.textContent = "---"
                 }
            
            });*/
        },
        setDate: function () {
            var currentDate = new Date();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            document.querySelector(DOMstrings.dateLabel).textContent = monthNames[currentDate.getMonth()] + "," + currentDate.getFullYear();
        },

        changeType: function () {
            var fields = document.querySelectorAll(DOMstrings.inputType + ","
                + DOMstrings.inputDesc + ","
                + DOMstrings.inputAmount);

            for (var i = 0; i < fields.length; i++) {
                fields[i].classList.toggle("red-focus");
            }
            document.querySelector(DOMstrings.addButton).classList.toggle("red");

        }

    };

})();

//**********************BUDGET CONTROLLER*************************************** */

var budgetController = (function () { // is IIFE, will handle data manipulation.
    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;

    }
    var Expense = function (id, desc, value, percent) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percent = -1;

    }
    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percent = Math.round((this.value / totalInc) * 100);
        }
        else {
            this.percent = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percent;

    };

    var calculateTotalBudget = function (type) {
        var sum = 0;
        if (type === "inc") {

            budgetData.allItems.allIncome.forEach(function (current) {
                sum += current.value;

            })
            budgetData.totals.inc = sum;
        }
        else if (type === "exp") {

            budgetData.allItems.allExpense.forEach(function (current) {
                sum += current.value;

            })
            budgetData.totals.exp = sum;
        }

    }

    var budgetData = {
        allItems: {
            allExpense: [],
            allIncome: []
        },
        totals: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        expensePercentage: -1
    };

    return {

        addItem: function (type, desc, val) {
            var budgetObject, ID;
            ID = 0;
            if (type === "inc") {

                if (budgetData.allItems.allIncome.length > 0) {
                    ID = budgetData.allItems.allIncome[budgetData.allItems.allIncome.length - 1].id + 1;
                }
                else {
                    ID = 0;
                }

                budgetObject = new Income(ID, desc, val);
                budgetData.allItems.allIncome.push(budgetObject);
            }

            else if (type === "exp") {
                if (budgetData.allItems.allExpense.length > 0) {
                    ID = budgetData.allItems.allExpense[budgetData.allItems.allExpense.length - 1].id + 1;
                }
                else {
                    ID = 0;
                }

                budgetObject = new Expense(ID, desc, val);
                budgetData.allItems.allExpense.push(budgetObject);

            }
            return budgetObject;
        },

        getBudget: function (type, budgetObject) {
            var budgetvalue;
            if (type === "inc") {
                budgetData.totals.inc = budgetData.totals.inc + budgetObject.amount;
                budgetvalue = budgetData.totals.inc;
            }
            else if (type === "exp") {

                budgetData.totals.exp = budgetData.totals.exp + budgetObject.amount;
                budgetvalue = budgetData.totals.exp;
            }
            return budgetvalue;
        },
        deleteItem: function (type, id) {
            var ids, index;

            if (type === "inc") {
                ids = budgetData.allItems.allIncome.map(function (current) {

                    return current.id;
                });
                index = ids.indexOf(id);
                if (index !== -1) {
                    budgetData.allItems.allIncome.splice(index, 1);
                }
             
            }
            else if (type === "exp") {
                ids = budgetData.allItems.allExpense.map(function (current) {

                    return current.id;
                });
                index = ids.indexOf(id);
                if (index !== -1) {
                    budgetData.allItems.allExpense.splice(index, 1);
                }


            }
        }
        ,
        calculateBudget: function () {

            //calculate total income and expense
            calculateTotalBudget("inc");
            calculateTotalBudget("exp");
            //calculate budget:income-expense
            budgetData.budget = budgetData.totals.inc - budgetData.totals.exp;//total budget
            //calculate expense percentage
            if (budgetData.totals.inc > 0) {
                budgetData.expensePercentage = Math.round((budgetData.totals.exp / budgetData.totals.inc) * 100);
            } else {
                budgetData.expensePercentage = -1;
            }


        },
        calculatePercentages: function () {
            budgetData.allItems.allExpense.forEach(function (current) {
                current.calcPercentage(budgetData.totals.inc);
            });

        },

        getPercentage: function () {
            var allPerc = budgetData.allItems.allExpense.map(function (current) {
                return current.getPercentage();
            });
            return allPerc;
        },
        getBudget: function () {
            return {
                income: budgetData.totals.inc,
                expense: budgetData.totals.exp,
                budget: budgetData.budget,
                expensePercentage: budgetData.expensePercentage
            }
        }
    }
})();


//**********************GLOBAL CONTROLLER*************************************** */

var globalAppController = (function (UICtrl, budgetCtrl) { //will provide connection to ui and budget                      var totalIncome=0,totalExpense=0,availableBalance=0,budgetExpensePercentage=0;                                                        controller.
    var setUpEventListeners = function () {
        var DOM = UICtrl.getDomstrings();

        document.querySelector(DOM.addButton).addEventListener("click", addBudget);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addBudget();
            }
        })
        document.querySelector(DOM.container).addEventListener("click", deleteBudget);
        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
    };


    var updateBudget = function () { //update budget value for income and expense and percentage at the top

        // calculate the budget(income, expense, expensepercentage and total)
        budgetCtrl.calculateBudget();
        //return the budget after calculating 
        var receivedBudget = budgetCtrl.getBudget();
        // display the budget in at the top UI
        UICtrl.displayUpdatedBudget(receivedBudget);
        console.log(receivedBudget);
    }

    var updateExpensePercentage = function () {
        //calculate the percentage
        budgetController.calculatePercentages();
        //get the percentage
        var allpercentage = budgetController.getPercentage();
        //update the ui with percentage
        UICtrl.displayPercentages(allpercentage);
        console.log(allpercentage);

    }

    var addBudget = function () {

        //get the data from the fields
        var inputData = UICtrl.getInput();

        if (inputData.amountdescription != "" && !isNaN(inputData.amount) && inputData.amount > 0) {
            //Add the data to the budget controller
            var budgetData = budgetCtrl.addItem(inputData.budgetType, inputData.amountdescription, inputData.amount);

            //Add budget data to the UI, i.e income or expense list
            var itemToAdd = UICtrl.addBudgetObjectToList(budgetData, inputData.budgetType);

            // clear input fields
            UICtrl.clearFields();

            //calculate budget for income and expense
            updateBudget();
            updateExpensePercentage();
           
        }
        else {
            UICtrl.clearFields();
        }

    }

    var deleteBudget = function (event) {
        var itemId, splitId, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId = itemId.split('-');
        type = splitId[0];
        ID = splitId[1];
        budgetCtrl.deleteItem(type, parseInt(ID)); //delete budget from data structure
        UICtrl.deleteBudgetObjectFromList(itemId); //delete item from UI list
        updateBudget();//update and show new budget
        updateExpensePercentage();
        

    }
    return {
        init: function () {

            UICtrl.displayUpdatedBudget({
                income: 0,
                expense: 0,
                budget: 0,
                expensePercentage: 0
            });
            UICtrl.setDate();
            setUpEventListeners();

            
        }
    };


})(UIController, budgetController);


globalAppController.init(); //initiate the programm


