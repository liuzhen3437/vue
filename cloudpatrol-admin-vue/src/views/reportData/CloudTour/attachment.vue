<template> 
  <address-detail :is-edit='false'></address-detail>
</template>
<script>
  import AddressDetail from './components/detail'
  export default {
    name: 'attachment',
    components: { AddressDetail }
  }
</script>
<style>
</style>

