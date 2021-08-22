<template>
  <div class="welcome">
    <p>silky dashboard</p>

  </div>
</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;
  margin-top: 1px;
  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    background: #fff;
    padding: 20px;
    border-bottom: 0.5px solid rgba($color: #ccc, $alpha: 0.3);
    .left-mark {
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .box-card {
    width: 80vw;
    margin: 10px auto;
    position: relative;
    #brokenLine {
      width: 100%;
      height: 50vh;
    }
  }
}
</style>
