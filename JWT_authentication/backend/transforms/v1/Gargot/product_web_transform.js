const transform = require('../../transform');

module.exports = class ProductWebTransform extends transform {

    transform(item) {
        let status;
        let newFoodList = []; // when can initialize variable use const
        for(var i=0; i < item.length; i++){
            if(item[i].other_info[0].status == 50){
                status = 'موجود';
            }else if(item[i].other_info[0].status == 55){
                status = 'ناموجود';
            }
            const foodList = [{
                'i': i,
                'food_name': item[i].product_name,
                'food_code': item[i].serial_number,
                'status': status,
                'cost': item[i].other_info[0].cost,
                'calery': item[i].other_info[0].calery,
                'weigth': item[i].other_info[0].weigth,
            }];
            newFoodList = newFoodList.concat(foodList);
            // console.log(reqList);
        }
        return newFoodList;
    }
}