<template> 
  <company-detail :is-edit='true'></company-detail>
</template>
<script>
  import CompanyDetail from './components/detail'
  export default {
    name: 'update',
    components: { CompanyDetail }
  } 
</script>
<style>
</style>

