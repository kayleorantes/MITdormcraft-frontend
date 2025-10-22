<script setup lang="ts">
import AuthComponent from '../components/AuthComponent.vue'
import ApiExamples from '../components/ApiExamples.vue'
</script>

<template>
  <main>
    <div class="home-container">
      <h1>MIT DormCraft</h1>
      <p>Welcome to MIT DormCraft - where students share their dorm room designs!</p>
      
      <AuthComponent />
      
      <div v-if="true" class="api-section">
        <ApiExamples />
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 18px;
}

.api-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid #eee;
}
</style>
