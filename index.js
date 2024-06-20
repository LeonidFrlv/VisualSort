const columnsElement = document.getElementById('columns');
const startBtn = document.getElementById('start_btn');
const percent = document.getElementById('percent');
const selectSortType = document.getElementById('select_sort_type');
const SELECTED_ITEM_COLOR = '#EC4A2A';
const MAX_SIZE_PERCENT = 89;

const generateColumns = (min, max) => {
    const arr = [];

    for (let i = 0; i < max + 1; i++) {
        arr.push({
            selected: false,
            value: generateUniqueInt(arr, min, max)
        });
    }

    return arr;
}

const generateUniqueInt = (arr, min, max) => {
    let int = min + Math.round(Math.random() * max);

    if (arr.length !== 0) {                
        const isExist = arr.find(item => item.value === int); 
        if (isExist) return generateUniqueInt(arr, min, max);
    }

    return int; 
}

let columns = generateColumns(1, 15);
let sortedColumns = [...columns].sort((a, b) => a.value - b.value);

const update = () => {
    let maxInt = 0;
    columns.forEach(item => {
        maxInt = Math.max(maxInt, item.value);
    });

    columnsElement.innerHTML = '';

    columns.forEach(item => {
        if (item.selected) {
            columnsElement.innerHTML += `
                <div class='column_wrapper'>
                    <div class='column' style='height:${item.value / maxInt * MAX_SIZE_PERCENT + '%'}; background:${SELECTED_ITEM_COLOR}'></div>
                    <div class='column_value' style='color:${SELECTED_ITEM_COLOR}'>${item.value}</div>
                </div>
            `
            return;
        } 

        columnsElement.innerHTML += `
            <div class='column_wrapper'>
                <div class='column' style='height: ${item.value / maxInt * MAX_SIZE_PERCENT + '%'}'></div>
                <div class='column_value'>${item.value}</div>
            </div>
        `
        
    });
}

update();

const setCompletedPercent = (current, max) => {
    percent.innerHTML = `${current / max * 100}%`
}

const delayedUpdate = () => {
    return new Promise(resolve => setTimeout(() => {
        update();
        resolve(); 
    }, 75));
}   

const bubbleSort = async () => {
    for (let i = 0, j = columns.length - 1; i < columns.length; i++, j--) {
        for (let k = 0; k < j; k++) {
            let nextIndex = k + 1;
            if (nextIndex === columns) break;
            let currentItem = columns[k];
            let nextItem = columns[nextIndex];
            currentItem.selected = true; 
            nextItem.selected = true; 
            if (nextItem.value < currentItem.value) {
                columns[k] = nextItem;
                columns[nextIndex] = currentItem;
            }
            await delayedUpdate();
            currentItem.selected = false; 
            nextItem.selected = false; 
        }

        if (JSON.stringify(sortedColumns) === JSON.stringify(columns)) {
            setCompletedPercent(1, 1);
            return;
        }
        
        setCompletedPercent(i + 1, columns.length);
    }
}

const selectionSort = async () => {
    let lastIndex = columns.length - 1;
    for (let i = 0; i < columns.length; i++) {
        for (let k = 0; k < lastIndex; k++) {
            let lastItem = columns[lastIndex];
            let currentItem = columns[k];
            lastItem.selected = true; 
            currentItem.selected = true; 
            if (currentItem.value > lastItem.value) {
                columns[k] = lastItem;
                columns[lastIndex] = currentItem;
            }
            await delayedUpdate();
            currentItem.selected = false; 
            lastItem.selected = false;
            lastItem = currentItem;
        }
        lastIndex--;

        if (JSON.stringify(sortedColumns) === JSON.stringify(columns)) {
            setCompletedPercent(1, 1);
            return;
        }
        
        setCompletedPercent(i + 1, columns.length);
    }
}

const combSort = async () => { //стырено с инета
    const factor = 1.247;
    let gapFactor = columns.length / factor;
    let i = 0;
    while (gapFactor > 1) {
        i++;
        const gap = Math.round(gapFactor);
        for (let i = 0, j = gap; j < columns.length; i++, j++) {
            let currentItem = columns[i];
            let gapItem = columns[j];
            currentItem.selected = true; 
            gapItem.selected = true; 
            if (columns[i].value > columns[j].value) {
                columns[i] = gapItem;
                columns[j] = currentItem;
            }
            await delayedUpdate();
            currentItem.selected = false; 
            gapItem.selected = false;
        }
        gapFactor = gapFactor / factor;

        if (JSON.stringify(sortedColumns) === JSON.stringify(columns)) {
            setCompletedPercent(1, 1);
            return;
        }
        
        setCompletedPercent(i + 1, columns.length);
    }
}


startBtn.onclick = async () => {
    const action = startBtn.innerHTML;
    
    if (action === 'СОРТИРОВАТЬ') {
        setCompletedPercent(0, 1);
        startBtn.innerHTML = 'В ПРОЦЕССЕ';
        startBtn.disabled = true;
        
        const sortType = selectSortType.value; 
        if (sortType === '\'Сортировка пузырьком\'') await bubbleSort();   
        if (sortType === '\'Сортировка выбором\'') await selectionSort();
        if (sortType === '\'Сортировка расчёской\'') await combSort();
        if (sortType === 'моментальная сортировка') {
            columns.sort((a, b) => a.value - b.value);
            setCompletedPercent(1, 1);
        }
        update();
        startBtn.innerHTML = 'СГЕНЕРИРОВАТЬ';
        startBtn.disabled = false;
    }

    if (action === 'СГЕНЕРИРОВАТЬ') {
        columns = generateColumns(1, 15);
        startBtn.innerHTML = 'СОРТИРОВАТЬ';
        update();
        return;
    }            
}