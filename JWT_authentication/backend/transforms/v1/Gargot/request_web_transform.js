const transform = require('../../transform');
// const jwt = require('jsonwebtoken');

module.exports = class RequestWebTransform extends transform {

    transform(item) {
        
        let status;
        let newReqList = []; // when can initialize variable use const
        // let Rcp = [];
        let mul = [];
        var amount, perCost, reqCode = 0;
        
        for(var i=0; i < item.length; i++){
            // har bar miad in dota ro 0 mikone baad shoro mikone be kar.
            var total = 0;
            let Rcp = [];
            
            for(var j = 0; j < item[i].detail[0].product_id.length; j++) {
                // console.log(item[i].detail[0]);
                const rcpDetail = [{
                   'id': j,
                   'code': item[i].detail[0].product_id[j].serial_number,
                   'product': item[i].detail[0].product_id[j].product_name,
                   'image': "https://smartbnd.ir/public/uploads/images/2021/6/2/"+item[i].detail[0].product_id[j].serial_number+".png",
                   'amount': item[i].detail[0].amount[j]
                }];
                Rcp = Rcp.concat(rcpDetail); 
                
                reqCode = item[i].request_code;
                amount = item[i].detail[0].amount[j];
                perCost = item[i].detail[0].product_id[j].other_info[0].cost;
                
                // meghdar A*C mirizam to array
                mul[j] = perCost*amount; 
                total = total + mul[j];
            }
            
            if (item[i].status == 21) {
                status = 'درخواست ثبت شد';
                
           /* } else if(item[i].status == 22) {
                status = 'درخواست به آشپزخونه رفت';
                */
            } else if(item[i].status == 23) {
                 status = 'درخواست مشاهده شد';
                
            } else if(item[i].status == 24) {
                status = ' سفارش تکمیل شد';
                
            } else if(item[i].status == 25) {
                status = 'درخواست لغو شد';
                
            } else {
                status = 'بدون وضعیت';
            }
            // console.log( 'request code: '+ reqCode + ' all items are: ' + Rcp);
            const reqList = [{
                'id': i+1,
                'full_name': item[i].user_id[0].personal_info[0]['first_name']+' '+item[i].user_id[0].personal_info[0]['last_name'],
                'recipe_code': item[i].request_code,
                'request_date': item[i].created_at.toLocaleDateString(),
                'request_time': item[i].created_at.toLocaleTimeString(),
                'status': status,
                'total_price': total,
                'food_name': item[i].request_name,
                'recipe_pic': item[i].request_pic,
                'recipe': Rcp,
                'destination': item[i].destination['send_address']
            }];
            newReqList = newReqList.concat(reqList);
        }
       
        return newReqList;
    }

}