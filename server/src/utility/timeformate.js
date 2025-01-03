function timeformate(time)
{
    try {
        
        const totalHours = time * 24;

   
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
      
      
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
console.log(formattedTime);
return formattedTime

    } catch (error) {
        console.log("error changing time",error);
    }
}

module.exports={timeformate}