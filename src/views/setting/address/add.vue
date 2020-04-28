<template> 
  <address-detail :is-edit='false'></address-detail>
</template>
<script>
  import AddressDetail from './components/detail'
  export default {
    name: 'update',
    components: { AddressDetail }
  }
</script>
<style>
</style>


