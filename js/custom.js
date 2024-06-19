$("#formValidation").validate({
  rules: {
    name: {
      minlength: 2,
    },
  },
  messages: {
    name: {
      required: "Please enter your name",
      minlength: "Name at least 2 characters",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
