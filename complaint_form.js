import aws from 'aws-sdk';
import { success, failure } from './inc/response';
import { create } from 'domain';
const documentClient = new aws.DynamoDB.DocumentClient();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const main = (event, context, callback) => {

   const data = JSON.parse(event.body)
//    const data = {
//        name: "Raj",
//        address: "C206",
//        district: "Patia",
//        state: "Bhubaneswar",
//        pincode: "751024",
//        phone: "7809694275",
//        email: "mail.rajdas@gmail.com",
//        company_name: "blinkdots",
//        position: "Developer",
//        problem_category: 1,
//        complaint_desc: "This is a complaint",

//    }
   console.log(data);
   
   const params = {
       TableName: process.env.COMPLAINTS_TABLE,
       Item:{
        complaintid: Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365.25),
        name: data.name,
        lin: data.lin,
        address: data.address,
        district: data.district,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        company_name: data.company_name,
        position: data.position,
        problem_category: data.problem_category,
        complaint_desc: data.complaint_desc,
        union_leader: data.union_leader || null,
        union_name: data.union_name || null,
        status: 0,
        officierid: 0,
        /*
            new complaints - 1
            approved - 2
        */

        critical: false,
        priority: null,
        officier_assigned: 0, 
        created_at: new Date().toISOString()
       }
   }
 
    console.log(params.Item);
    
   documentClient.put(params, (err, result) => {
        if(err) {
            console.log(err);
            callback(null , failure({ status: false, message: 'failed to registered complaint' }))
        } else {
            console.log(params.Item)
            const msg = {
                to: `${data.email}`,
                from: 'test@example.com',
                subject: 'Complaint Status',
                text: `Your complaint has been registered and registered to proceed. Your complaint Id: ${data.complaintid}`,
            };
            sgMail.send(msg);
        
            callback(null, success({status: true, message: 'complaint is successfully registered' }))
        }
   })
}