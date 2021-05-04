<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/swap" :name="$t('sidebar.swap')" icon="tim-icons icon-double-right"/>
        <sidebar-link to="/pools" :name="$t('sidebar.pools')" icon="tim-icons icon-app"/>
        <sidebar-link to="/typography" :name="$t('sidebar.typography')" icon="tim-icons icon-align-center"/>
        <sidebar-link to="/icons" :name="$t('sidebar.icons')" icon="tim-icons icon-atom"/>
      </template>
    </side-bar>
    <div class="main-panel">

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
