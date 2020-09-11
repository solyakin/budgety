//IIFE immediately invoked function expression

// 1. budgetcontroller
// 2. UIcontroller
// 3. global app controller

//BUDGET CONTROLLER
const budgetcontroller = (function(){
    const Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotals = function(type){
        let sum = 0;
        data.allItem[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.total[type] = sum;
    }

    let data = {
        allItem : {
            inc : [],
            exp : []
        },
        total : {
            inc : 0,
            exp : 0
        },
        budget : 0,
        percentage : -1
            
    }

    return{
        addItem : function (type, des, val){
            var id = 0;
            var newItem;
            if(type === 'inc'){
                newItem = new Income(id, des, val);
            } else if(type === 'exp'){
                newItem = new Expense(id, des, val);
            };
            data.allItem[type].push(newItem);

            return newItem;
        },
        calculateBudget : function(){
            
            calculateTotals('inc');
            calculateTotals('exp');

            //calcuale the budget
            data.budget = data.total.inc - data.total.exp;
            //calculate percentage
            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            // 50/100 = 0.5 * 100 = 50%
        },
        getBudget : function(){
            return{
                budget : data.budget,
                totalInc : data.total.inc,
                totalExp : data.total.exp,
                percentage : data.percentage
            }
        },

        publicTest : function(){
            console.log(data);
        }
    }
    
})();

//UI CONTROLLER
const UIController = (function(){

    const domStrings = {
        expList : '.expenses__list',
        incList : '.income__list',
        budgetValue : '.budget__value',
        incomeValue : '.budget__income--value',
        expValue : '.budget__expenses--value',
        percValue : '.budget__expenses--percentage',
        displayMonth : '.budget__title--month'
    }
    
    return{
        inputValue : function (){
            return {
                type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                value : parseFloat(document.querySelector('.add__value').value)
            }
        },
        clearInputs: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll('.add__description' + ', ' + '.add__value');
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        display : function(obj, type){
            
            var markUp, element;
            if(type === 'inc'){
                element = document.querySelector(domStrings.incList);
                markUp = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                        `
            } else if(type === 'exp'){
                element = document.querySelector(domStrings.expList);
                markUp = `<div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                                <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                        `
            }
            element.insertAdjacentHTML('beforeend', markUp);
        },
        getDomStrings : function (){
            return domStrings
        },

        month : function() {

            let date, month, months, year;
            date = new Date();

            month = date.getMonth();

            months = ['january', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            year = date.getFullYear();

            document.querySelector(domStrings.displayMonth).textContent = months[month] + ' ' + year;

        }
    };

})();

//GLOBAL CONTROLLER
const controller = (function(budgetCtrl, uiCtrl){
    const submitBtn = document.querySelector('.add__btn');

    const eventSetUp = () =>{

        //get the values of the input field
        var input = uiCtrl.inputValue();
        console.log(input)

        //celar inputs
        uiCtrl.clearInputs();

        if(input.description !== '' && input.value !== '' && input.value > 0){
            //insert the value into the budgetcontroller to create object
        var newItems = budgetCtrl.addItem(input.type, input.description, input.value);

        //display on the UI
        uiCtrl.display(newItems, input.type)

        //calculate the budget
        budgetCtrl.calculateBudget();

        //return the budget values
        var results = budgetCtrl.getBudget()

        const element = uiCtrl.getDomStrings();

        document.querySelector(element.budgetValue).textContent = `${results.budget}`
        document.querySelector(element.incomeValue).textContent = `${results.totalInc}`
        document.querySelector(element.expValue).textContent = `${results.totalExp}`
        document.querySelector(element.percValue).textContent = `${results.percentage}%`;

        uiCtrl.month();
        
        };

    }

    submitBtn.addEventListener('click', ()=>{
        eventSetUp()
    });

    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            eventSetUp()
        }
    })
    
})(budgetcontroller, UIController);