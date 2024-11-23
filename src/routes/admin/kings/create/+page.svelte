<script lang="ts">
  import {
    Label,
    Input,
    Button,
    Card,
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    TableBodyCell,
    Select,
  } from 'flowbite-svelte'
  import { kingdomsOptions } from '$lib/model/general'
  import { superForm } from 'sveltekit-superforms'
  import { toast } from 'svelte-sonner'
  import { characterLoaded } from '$lib/model/schemas.js'

  let { data } = $props()
  let kings = $state(data.kings)
  let selected: number = $state(NaN)

  const { form, errors, constraints, submitting, delayed, message, enhance, reset } = superForm(
    data.form,
    {
      onResult: async event => {
        const result = event.result
        console.log('Form submission result', result)
        if (result.type === 'success') {
          toast.success('Row updated successfully!')
        } else if (result.type === 'failure') {
          toast.error('Error updating row', {
            description: `${result.data?.err.message}`,
          })
        }
      },
    },
  )

  function getSubmitText() {
    if ($form?.id) {
      return submitting || delayed ? 'Updating' : 'Update'
    } else return submitting || delayed ? 'Creating' : 'Create'
  }
</script>

<div class="cont mb-6">
  <Card>
    <form action="?/upsertKing" method="POST" use:enhance>
      <input type="hidden" name="id" bind:value={$form.id} />
      <div class="mb-2">
        <Label for="name" color="green" class="mb-2 block">Name</Label>
        <Input
          id="name"
          name="name"
          color="green"
          bind:value={$form.name}
          {...$constraints.name}
          placeholder="Name"
        />
      </div>
      <div class="mb-2">
        <Label for="startOfReign" color="green" class="mb-2 block">Start of Reign</Label>
        <Input
          id="startOfReign"
          name="startOfReign"
          type="number"
          color="green"
          bind:value={$form.startOfReign}
          {...$constraints.startOfReign}
        />
      </div>
      <div class="mb-2">
        <Label for="endOfReign" color="green" class="mb-2 block">End of Reign</Label>
        <Input
          id="endOfReign"
          name="endOfReign"
          type="number"
          color="green"
          bind:value={$form.endOfReign}
          {...$constraints.endOfReign}
        />
      </div>
      <div class="mb-2">
        <Label for="lengthOfReign" color="green" class="mb-2 block">Length of Reign</Label>
        <Input
          id="lengthOfReign"
          name="lengthOfReign"
          color="green"
          placeholder="Length of Reign"
          bind:value={$form.lengthOfReign}
          {...$constraints.lengthOfReign}
        />
      </div>
      <div class="mb-2">
        <Label for="kingdom" color="green" class="mb-2 block">Kingdom</Label>
        <Select
          defaultClass="text-gray-900 disabled:text-gray-400 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          id="kingdom"
          name="kingdom"
          size="lg"
          items={kingdomsOptions}
          bind:value={$form.kingdom}
          {...$constraints.kingdom}
        />
      </div>
      <div class="mb-2">
        <Label for="relationToPredecessor" color="green" class="mb-2 block"
          >Relation To Predecessor</Label
        >
        <Input
          id="relationToPredecessor"
          name="relationToPredecessor"
          color="green"
          placeholder="Relation To Predecessor"
          bind:value={$form.relationToPredecessor}
          {...$constraints.relationToPredecessor}
        />
      </div>
      <Button color="dark" type="submit">{getSubmitText()}</Button>
      <Button color="dark" onclick={() => reset()}>Reset form</Button>
    </form>
  </Card>

  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Length of Reign</TableHeadCell>
      <TableHeadCell>Start of Reign</TableHeadCell>
      <TableHeadCell>End of Reign</TableHeadCell>
      <TableHeadCell>Kingdom</TableHeadCell>
      <TableHeadCell>Relation To Predecessor</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each kings as king}
        <tr
          style:background-color={selected === king.id ? 'lightskyblue' : 'skyblue'}
          onclick={() => {
            selected = king.id
            reset({ data: king })
          }}
        >
          <TableBodyCell>{king.name}</TableBodyCell>
          <TableBodyCell>{king.lengthOfReign}</TableBodyCell>
          <TableBodyCell>{king.startOfReign}</TableBodyCell>
          <TableBodyCell>{king.endOfReign}</TableBodyCell>
          <TableBodyCell>{king.kingdom}</TableBodyCell>
          <TableBodyCell>{king.relationToPredecessor}</TableBodyCell>
        </tr>
      {/each}
    </TableBody>
  </Table>
</div>

<style>
  .cont {
    max-width: 900px;
    width: max-content;
    margin: 2rem auto;
  }
</style>
