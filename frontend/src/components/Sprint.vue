<template>
    <div class="wrapper" id="wrapper">
     <div role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-1 variant="info">Project 1 (AX-454-DF)</b-button>
      </b-card-header>
      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
        <div class="align-right">
           <input class="button" type="button" value="Add More Task"> 
        </div>
         
        <b-card-body>
         <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Task</th>
                <th scope="col">Project</th>
                <th scope="col">Completion</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>topup service</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>cron for fees calculation</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>mail service for how we can store send/fail/read mail</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
            </tbody>
            </table>

        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-2 variant="info">Accordion 2</b-button>
      </b-card-header>
      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
        <b-badge variant="primary">Signed off: Yes</b-badge> 
        <b-badge variant="success">PO Rating: 4 / 5</b-badge>
        <b-badge variant="warning">Guruji Rating: 8/10</b-badge>
        <b-badge variant="info">Total allcoation: 20%</b-badge>
        <b-badge variant="light">Total complition: 20%</b-badge>
         
        <input type="button" value="Add More Task">    
        <b-card-body>
          <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Task</th>
                <th scope="col">Project</th>
                <th scope="col">Team</th>
                <th scope="col">Completion</th>
                <th scope="col">Option</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>topup service</td>
                <td>Zephx - Web</td>
                <td>Backend</td>
                <td>0%</td>
                <td>
                        <span>
                            <b-icon icon="pencil-square"></b-icon>
                        </span> 
                        <span>
                            <b-icon icon="trash"></b-icon>
                        </span>
                </td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>cron for fees calculation</td>
                <td>Zephx - Web</td>
                <td>Backend</td>
                <td>0%</td>
                <td>
                        <span>
                            <b-icon icon="pencil-square"></b-icon>
                        </span> 
                        <span>
                            <b-icon icon="trash"></b-icon>
                        </span>
                </td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>mail service for how we can store send/fail/read mail</td>
                <td>Zephx - Web</td>
                <td>Backend</td>
                <td>0%</td>
                <td>
                        <span>
                            <b-icon icon="pencil-square"></b-icon>
                        </span> 
                        <span>
                            <b-icon icon="trash"></b-icon>
                        </span>
                </td>
                </tr>
            </tbody>
            </table>
            
        </b-card-body>
        <b-card
            title="Zephx - Web app"
            tag="article"
            style="max-width: 40%"
            class="mb-2"
        >
            <b-card-text>
             <div class="mb-4">
                <b-avatar></b-avatar>
                <b-avatar variant="primary" text="BV"></b-avatar>
                <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>
                <b-avatar variant="success" icon="people-fill"></b-avatar>
            </div>
            </b-card-text>

            <b-button href="#" variant="primary">Update resource</b-button>
        </b-card>
        <b-card
            title="Zephx - Web app"
            tag="article"
            style="max-width: 40%"
            class="mb-2"
        >
            <b-card-text>
             <div class="mb-4">
                <b-avatar></b-avatar>
                <b-avatar variant="primary" text="BV"></b-avatar>
                <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>
                <b-avatar variant="success" icon="people-fill"></b-avatar>
            </div>
            </b-card-text>

            <b-button href="#" variant="primary">Update resource</b-button>
        </b-card>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-3 variant="info">Accordion 3</b-button>
      </b-card-header>
      <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Task</th>
                <th scope="col">Project</th>
                <th scope="col">Completion</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>topup service</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>cron for fees calculation</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>mail service for how we can store send/fail/read mail</td>
                <td>Zephx - Web</td>
                <td>0%</td>
                </tr>
            </tbody>
            </table>
            
        </b-card-body>
      </b-collapse>
    </b-card>
  </div> 
  </div>   
</template>

<script>
export default {
    name: "Sprint"
}
</script>

<style scoped>

</style>

<script>
  export default {
    data() {
      return {
        text: `
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
          richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
          brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
          tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
          assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
          wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
          vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
          synth nesciunt you probably haven't heard of them accusamus labore VHS.
        `
         
      }
    }
  }
</script>