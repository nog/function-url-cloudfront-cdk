export const handler = async (event: any): Promise<any> => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    
    try {
      let body = {};
      if (event.body) {
        body = JSON.parse(event.body);
      }
  
      const response = {
        message: 'Hello from Lambda Function URL!',
        timestamp: new Date().toISOString(),
        requestContext: event.requestContext
      };
  
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  };