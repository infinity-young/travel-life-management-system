export function validateForm(formData:Record<string, any>) {
    const validateResult = {
        isValidated: true,
        unvalidatedKey:''
    }
    const data = Object.entries(formData);
    for (let i = 0; i < data.length; i++){
        if (typeof data[i][1] === 'string' && data[i][1]?.trim?.().length === 0) {
            validateResult.unvalidatedKey = data[i][0];
            validateResult.isValidated = false;
        break;
      }
    }
    return validateResult;

  };