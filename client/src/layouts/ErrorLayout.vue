<template>
  <div>
    {{ $t('error.general.title') }}
    {{ $t('error.general.description') }}
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ErrorLayout extends Vue {}
</script>
