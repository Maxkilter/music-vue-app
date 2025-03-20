export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.icon}`;

    if (binding.value.color) {
      iconClass += ` text-${binding.value.color}-400`;
    }
    el.innerHTML += `<i class="${iconClass}" />`;
  },
};
