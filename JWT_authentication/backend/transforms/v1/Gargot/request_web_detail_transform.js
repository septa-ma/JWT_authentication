const transform = require('../../transform');
// const jwt = require('jsonwebtoken');

module.exports = class RequestWebTransform extends transform {

    transform(item) {
        
        let Rcp = [];
        var amount = 0;
        
        for(var i=0; i < item.length; i++){
            
            for(var j = 0; j < item[i].detail[0].product_id.length; j++) {
                
                const rcpDetail = [{
                   'product': item[i].detail[0].product_id[j].product_name,
                   'image': "https://smartbnd.ir/public/uploads/images/2021/6/2/"+item[i].detail[0].product_id[j].serial_number+".png",
                   'amount': item[i].detail[0].amount[j]
                }];
                Rcp = Rcp.concat(rcpDetail); 
            }
        }
       
        return Rcp;
    }

}