const showToast = (toast, title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "top", 
    });
  };
  
  export default showToast;
  
