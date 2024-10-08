<script setup>
import Modal from "./Modal.vue";
import { ref } from "vue";
import { useEncounter } from "../stores/encounter";
import { useModals } from "../stores/modals";

const tab = ref("history");
const encounter = useEncounter();
const modals = useModals();

function generateNew() {
  encounter.generateRandom();
  modals.hide("encounter");
}
</script>

<template>
  <Modal v-model:show="modals.encounter">
    <div class="w-full flex pb-3">
      <div class="sm:hidden w-full">
        <label for="tabs" class="sr-only">Select a tab</label>
        <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
        <select
          v-model="tab"
          id="tabs"
          name="tabs"
          class="text-center border-gray-300 shadow-sm focus:ring-kbp-500 focus:border-kbp-500 block w-full p-1.5 pr-0 sm:text-sm disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 text-gray-600 rounded-md"
        >
          <option value="history" selected>Encounter History</option>

          <option value="saved">Saved Encounters</option>
        </select>
      </div>
      <div class="hidden w-full sm:block">
        <div class="border-b-2 border-gray-200 dark:border-gray-700">
          <nav
            class="-mb-[2px] justify-center flex space-x-8"
            aria-label="Tabs"
          >
            <!-- Current: "border-kbp-500 text-kbp-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
            <a
              @click="tab = 'history'"
              href="javascript:"
              :class="{
                'border-kbp-500 text-kbp-600': tab === 'history',
                'border-transparent text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 hover:text-gray-700 hover:border-gray-300':
                  tab !== 'history',
              }"
              class="inline-block whitespace-nowrap py-4 px-1 border-b-2 font-medium"
            >
              <i class="fa fa-history pr-2"></i> Encounter History
            </a>

            <a
              @click="tab = 'saved'"
              href="javascript:"
              :class="{
                'border-kbp-500 text-kbp-600': tab === 'saved',
                'border-transparent text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 hover:text-gray-700 hover:border-gray-300':
                  tab !== 'saved',
              }"
              class="inline-block whitespace-nowrap py-4 px-1 border-b-2 font-medium"
            >
              <i class="fa fa-save pr-2"></i> Saved Encounters
            </a>
          </nav>
        </div>
      </div>
    </div>

    <div v-show="tab === 'saved'" class="my-3 sm:mt-0 w-full">
      <div
        class="mt-2 max-h-96 overflow-y-auto scrollbar divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300"
      >
        <div
          v-for="(_, index) of encounter.saved"
          @click="
            encounter.loadedIndex !==
              encounter.saved.length - index - 1 &&
              encounter.loadFromSaved(encounter.saved.length - index - 1)
          "
          class="flex px-2 py-4 dark:border-gray-700 w-100 relative"
          :title="
            encounter.saved[encounter.saved.length - index - 1]
              .map((group) => `${group.monster.name} x${group.count}`)
              .join(', ')
          "
          :key="index"
          :class="{
            'group hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer':
              encounter.loadedIndex !==
              encounter.saved.length - index - 1,
          }"
        >
          <div
            class="grow flex items-center mr-2 grow truncate overflow-ellipsis"
            :class="{
              'font-medium':
                encounter.loadedIndex ===
                encounter.saved.length - index - 1,
            }"
          >
            <span
              v-text="
                encounter.saved[encounter.saved.length - index - 1]
                  ? encounter.saved[encounter.saved.length - index - 1]
                      .map((group) => `${group.monster.name} x${group.count}`)
                      .join(', ')
                  : ''
              "
            ></span>
          </div>
          <div
            class="shrink-0 grid grid-cols-[30px_1fr] place-items-center h-full absolute inset-y-0 right-0"
            type="button"
          >
            <div
              class="w-full h-full bg-gradient-to-l from-white dark:from-gray-800 group-hover:from-gray-50 dark:group-hover:from-gray-700 to-transparent"
            ></div>
            <div
              class="flex px-3 bg-white group-hover:bg-gray-50 dark:bg-gray-800 dark:group-hover:bg-gray-700 min-w-4 h-full text-right inset-y-0 right-0 space-x-2 absolute"
            >
              <div
                v-show="
                  encounter.loadedIndex ===
                  encounter.saved.length - index - 1
                "
                class="text-kbp-600 h-full flex items-center justify-center"
              >
                <i class="fa fa-check-circle pr-1"></i> Loaded
              </div>
              <div
                v-show="
                  encounter.loadedIndex !==
                  encounter.saved.length - index - 1
                "
                class="items-center h-full justify-center cursor-pointer select-none hidden group-hover:flex text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <i class="pr-1 fas fa-upload"></i> Load
              </div>
              <div
                class="items-center justify-center h-full cursor-pointer select-none hidden group-hover:flex text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-600"
                @click.stop="encounter.deleteSaved(index)"
              >
                <i class="pr-1 fas fa-times"></i> Delete
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="!encounter.saved.length"
        type="button"
        class="relative block w-full border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg p-12 text-center"
      >
        <span
          class="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
        >
          You have no encounters saved
        </span>
      </div>
    </div>

    <div v-show="tab === 'history'" class="my-3 sm:mt-0 w-full">
      <div
        class="mt-2 max-h-96 overflow-y-auto scrollbar divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300"
      >
        <div v-for="(_, index) of encounter.history">
          <div
            class="flex px-2 py-4 dark:border-gray-700 w-100 relative"
            :title="
              encounter.history[encounter.history.length - index - 1]
                .map((group) => `${group.monster.name} x${group.count}`)
                .join(', ')
            "
            :class="{
              'group hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer': !(
                encounter.loadedIndex === null &&
                index === 0 &&
                encounter.groups.length
              ),
            }"
            @click="
              !(
                encounter.loadedIndex === null &&
                index === 0 &&
                encounter.groups.length
              ) &&
                encounter.loadFromHistory(encounter.history.length - index - 1)
            "
            :key="index"
          >
            <div
              class="grow flex flex-col justify-center mr-2 grow truncate overflow-ellipsis"
              :class="{
                'font-medium':
                  encounter.loadedIndex === null &&
                  index === 0 &&
                  encounter.groups.length,
              }"
            >
              <span
                v-text="
                  encounter.history[encounter.history.length - index - 1]
                    ? encounter.history[encounter.history.length - index - 1]
                        .map((group) => `${group.monster.name} x${group.count}`)
                        .join(', ')
                    : ''
                "
              ></span>
            </div>
            <div
              class="shrink-0 grid grid-cols-[30px_1fr] place-items-center h-full absolute inset-y-0 right-0"
              type="button"
            >
              <div
                class="w-full h-full bg-gradient-to-l from-white dark:from-gray-800 group-hover:from-gray-50 dark:group-hover:from-gray-700 to-transparent"
              ></div>
              <div
                class="px-3 bg-white group-hover:bg-gray-50 dark:bg-gray-800 dark:group-hover:bg-gray-700 min-w-4 h-full grid place-items-center"
              >
                <div
                  class="hidden group-hover:block text-gray-900 dark:text-gray-100"
                >
                  Load <i class="fa fa-arrow-right"></i>
                </div>
                <div
                  v-show="
                    encounter.loadedIndex === null &&
                    index === 0 &&
                    encounter.groups.length
                  "
                  class="text-kbp-600"
                >
                  <i class="fa fa-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-show="!encounter.history.length"
        @click="generateNew"
        type="button"
        class="relative block w-full border-2 border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kbp-500"
      >
        <i
          class="fa-solid fa-dice-d20 text-2xl h-12 w-12 mx-auto text-gray-400 dark:text-gray-300"
        ></i>
        <span
          class="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
        >
          Roll for history
        </span>
      </button>
    </div>

    <template #footer>
      <button
        @click="modals.hide('encounter')"
        type="button"
        class="button-primary-md"
      >
        Close
      </button>
      <button
        v-show="tab === 'history'"
        @click="encounter.history = []"
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-kbp-700 dark:bg-kbp-100 dark:bg-transparent dark:text-kbp-500 dark:hover:bg-kbp-800 dark:hover:text-white hover:bg-kbp-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kbp-500"
      >
        <i class="fa fa-times mr-1"></i> Clear History
      </button>
    </template>
  </Modal>
</template>

<style scoped></style>
