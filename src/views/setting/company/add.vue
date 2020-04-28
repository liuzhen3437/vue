<template> 
  <company-detail :is-edit='false'></company-detail>
</template>
<script>
  import CompanyDetail from './components/detail'
  export default {
    name: 'add',
    components: { CompanyDetail }
  } 
</script>
<style>
</style>

