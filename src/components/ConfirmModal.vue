<!-- ConfirmModal.vue -->
<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this item?</p>
        <div class="btn-container">
          <button @click="confirm" class="danger">Yes</button>
          <button @click="cancel">No</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm');
      },
      cancel() {
        this.$emit('cancel');
      }
    }
  };
  </script>
  
  <style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    text-align: center;
    border-radius: 5px;
    background-color: #503333;
    padding: 10px 10px 5px 20px;
    box-shadow: 2px;
    padding: 10px 10px 10px 20px;
    margin-bottom: 15px;
    margin-right: 25px;
  }
  .btn-container{
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }
  button{
    font-weight: 700;
    height: fit-content;
    padding: 10px 20px 10px 20px;
    background-color: #B7B8AC;
    color: #2E181A;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  button:hover{
    transform: translateY(5px);
    box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
  }
  .danger{
    background-color: #77030d;
    color: #B7B8AC;
    border-color: #B7B8AC;
    border-width: 2px;
    border-style:solid;
  }
  </style>
  