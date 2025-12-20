<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: false
  }
});
</script>

<template>
	<section class="chat-message" :id="id">
		<slot></slot>
	</section>
</template>

<style>
	.chat-message {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 575px;
	}
</style>