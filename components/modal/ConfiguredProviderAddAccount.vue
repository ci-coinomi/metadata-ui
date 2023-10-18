<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <article
      ref="modalRef"
      class="box-border flex w-[50vw] flex-col items-center gap-2 overflow-x-auto rounded-md bg-white px-14 py-7"
    >
      <h2 class="text-center text-2xl font-bold">Manage accounts</h2>

      <div class="flex w-full gap-6 pr-6">
        <h3 class="w-1/2 text-center text-xl font-bold">Available</h3>
        <h3 class="w-1/2 text-center text-xl font-bold">Selected</h3>
      </div>

      <div
        class="flex max-h-[65vh] w-full items-start justify-center gap-6 overflow-x-auto pr-2 pt-2 shadow-sm"
      >
        <div class="w-1/2">
          <p
            v-if="availableAccounts.length === 0"
            class="py-10 text-center text-lg"
          >
            No accounts available
          </p>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <article
              v-for="availableAccount in availableAccounts"
              :key="availableAccount.name"
              class="flex w-full flex-col justify-center gap-2"
            >
              <div class="flex items-center justify-between">
                <p>Name: {{ availableAccount.name }}</p>
                <UiButton
                  class="success"
                  @click="onAddAccountClick(availableAccount)"
                >
                  Add
                </UiButton>
              </div>
              <div
                class="flex flex-col gap-2 rounded-lg border border-gray-400 p-2"
              >
                <div
                  v-for="(value, key) in availableAccount.fullAccount"
                  :key="key"
                  class="flex gap-2 py-1"
                  :class="
                    isObject(value) || Array.isArray(value)
                      ? 'items-start'
                      : 'items-center'
                  "
                >
                  <p
                    :class="
                      isObject(value) || Array.isArray(value)
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    "
                  >
                    {{ key }}
                  </p>
                  <UiSwitcher
                    v-if="typeof value === 'boolean'"
                    :value="value"
                    disabled
                    class="opacity-50"
                  />
                  <UiInputField
                    v-else
                    :model-value="value"
                    type="text"
                    :disabled="true"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="w-1/2">
          <p
            v-if="selectedAccounts.length === 0"
            class="py-10 text-center text-lg"
          >
            Select at least one account
          </p>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <article
              v-for="selectedAccount in selectedAccounts"
              :key="selectedAccount.name"
              class="flex w-full flex-col justify-center gap-2"
            >
              <div class="flex items-center justify-between">
                <p>Name: {{ selectedAccount.name }}</p>
                <UiButton
                  class="danger"
                  @click="onRemoveAccountClick(selectedAccount)"
                >
                  Remove
                </UiButton>
              </div>
              <div
                class="flex flex-col gap-2 rounded-lg border border-gray-400 p-2"
              >
                <div
                  v-for="(value, key) in selectedAccount.fullAccount"
                  :key="key"
                  class="flex gap-2 py-1"
                  :class="
                    isObject(value) || Array.isArray(value)
                      ? 'items-start'
                      : 'items-center'
                  "
                >
                  <p
                    :class="
                      isObject(value) || Array.isArray(value)
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    "
                  >
                    {{ key }}
                  </p>
                  <UiSwitcher
                    v-if="typeof value === 'boolean'"
                    :value="value"
                    disabled
                    class="opacity-50"
                  />
                  <UiInputField
                    v-else
                    :model-value="value"
                    type="text"
                    :disabled="true"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div class="flex w-1/2 justify-evenly gap-4">
        <UiButton class="danger w-1/3" @click="onCanselClickHandler">
          Cancel
        </UiButton>
        <UiButton class="success w-1/3" @click="onConfirmHandler">
          Confirm
        </UiButton>
      </div>
    </article>
  </div>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();
const { $toast } = useNuxtApp();

const props = defineProps([
  "currentProviderList",
  "accountList",
  "defaultList",
  "isFieldNew",
]);
const emit = defineEmits(["isModalConfirmed"]);

const modalRef = ref();
const availableAccounts = ref([]);
const selectedAccounts = ref([]);

const storedAccounts = computed(() => store.providerAccounts);

// const isApiKeyDeletable = (name) => {
//   if (props.defaultList.find((item) => item === name) && !props.isFieldNew)
//     return true;
// };

const onAddAccountClick = (acc) => {
  const newArray = availableAccounts.value.filter(
    (item) => item.name !== acc.name,
  );
  availableAccounts.value = newArray;
  selectedAccounts.value.push(acc);
};

const onRemoveAccountClick = (acc) => {
  const newArray = selectedAccounts.value.filter(
    (item) => item.name !== acc.name,
  );
  selectedAccounts.value = newArray;
  availableAccounts.value.push(acc);
};

const onCanselClickHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  if (
    selectedAccounts.value.length === 0 &&
    availableAccounts.value.length > 0
  ) {
    $toast.warning("You need to select at least one account");
    return;
  }
  const newSelectedAccounts = selectedAccounts.value.map(
    (account) => account.name,
  );
  emit("isModalConfirmed", newSelectedAccounts);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit("isModalConfirmed", false);
  }
};

const serializeAccouts = () => {
  const totalAccounts = props.accountList.map((acc) => {
    const fullAccountObject = storedAccounts.value.find(
      (item) => item.keyName === acc,
    );
    return {
      name: acc,
      fullAccount: fullAccountObject,
    };
  });

  selectedAccounts.value = props.currentProviderList.map((acc) =>
    totalAccounts.find((item) => item.name === acc),
  );

  availableAccounts.value = totalAccounts.filter(
    (account) =>
      !selectedAccounts.value.some(
        (selectedAccount) => account.name === selectedAccount.name,
      ),
  );
};

onMounted(() => {
  serializeAccouts();
  document.body.style.overflow = "hidden";
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
