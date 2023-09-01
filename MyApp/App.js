import React, { Component } from 'react';
import { View, Text, Dimensions, ActivityIndicator, Linking, TouchableOpacity, Button } from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      scale: 1.0,
      pdfUri: 'http://www.gurumann.com/MASS-UP_eBook.pdf' // PDF source URI
    };
  }

  nextPage = () => {
    this.setState({ currentPage: this.state.currentPage + 1 });
  };

  previousPage = () => {
    this.setState({ currentPage: this.state.currentPage - 1 });
  };

  zoomIn = () => {
    this.setState({ scale: this.state.scale + 0.2 });
  };

  zoomOut = () => {
    this.setState({ scale: this.state.scale - 0.2 });
  };

  downloadPdf = () => {
    const { dirs } = RNFetchBlob.fs;
    const pdfURL = this.state.pdfUri;
    const pdfName = 'downloaded_pdf.pdf';

    RNFetchBlob.config({
      path: `${dirs.DownloadDir}/${pdfName}`,
    })
    .fetch('GET', pdfURL, {})
    .then(res => {
      console.log('PDF downloaded:', res.path());
    })
    .catch(error => {
      console.log('PDF download error:', error);
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }}>Pdf-Viewer</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={this.previousPage} style={{ backgroundColor: 'skyblue', padding: 10 }}>
            <Text style={{ fontSize: 20, color: 'black' }}>Previous Page</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nextPage} style={{ backgroundColor: 'red', padding: 10 }}>
            <Text style={{ fontSize: 20, color: 'black' }}>Next Page</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
          <Button onPress={this.zoomIn} title="+" />
          <Text style={{ fontSize: 20, marginLeft: 10, marginRight: 10 }}>Zoom: {this.state.scale.toFixed(1)}</Text>
          <Button onPress={this.zoomOut} title="-" />
        </View>
        <Button onPress={this.downloadPdf} title="Download PDF" />
        <Pdf
          trustAllCerts={false}
          source={{
            uri: this.state.pdfUri
          }}
          page={this.state.currentPage}
          scale={this.state.scale}
          minScale={1.0}
          maxScale={4.0}
          renderActivityIndicator={() => (
            <ActivityIndicator color="white" size="large" />
          )}
          enablePaging={true}
          onLoadProgress={(percentage) => console.log(`Loading: ${percentage}`)}
          onLoadComplete={() => console.log('Loading Complete')}
          onPageChanged={(page, totalPages) => {
            console.log(`${page}/${totalPages}`);
            this.setState({ currentPage: page }); // Update current page
          }}
          onError={(error) => console.log(error)}
          onPressLink={(link) => Linking.openURL(link)}
          onScaleChanged={(scale) => console.log(scale)}
          spacing={5}
          style={{ flex: 1, backgroundColor: 'black', width: Dimensions.get('window').width }}
        />
      </View>
    );
  }
}

export default App;
